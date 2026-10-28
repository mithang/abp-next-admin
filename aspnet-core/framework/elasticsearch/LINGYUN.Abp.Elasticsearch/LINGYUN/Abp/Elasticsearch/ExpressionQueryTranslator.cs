using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.Elasticsearch;

/// <summary>
/// Bộ chuyển đổi truy vấn biểu thức - Chuyển đổi biểu thức LINQ thành truy vấn Elasticsearch
/// </summary>
public partial class ExpressionQueryTranslator : IExpressionQueryTranslator, ISingletonDependency
{
    private readonly IIndexMappingProvider _indexMappingProvider;

    public ExpressionQueryTranslator(
        IIndexMappingProvider indexMappingProvider)
    {
        _indexMappingProvider = indexMappingProvider;
    }

    /// <summary>
    /// Dịch biểu thức
    /// </summary>
    public async virtual Task<Query> TranslateAsync<TDocument>(string indexName, Expression<Func<TDocument, bool>> expression)
    {
        Check.NotNullOrWhiteSpace(indexName, nameof(indexName));
        Check.NotNull(expression, nameof(expression));

        var indexMapping = await _indexMappingProvider.GetMappingAsync<TDocument>(indexName);

        return TranslateNode(expression.Body, prefix: null, indexMapping);
    }

    #region Dịch nút

    /// <summary>
    /// Dịch nút biểu thức
    /// </summary>
    protected virtual Query TranslateNode(Expression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        return node switch
        {
            ConstantExpression { Value: bool value } =>
                value ? new MatchAllQuery() : new MatchNoneQuery(),

            UnaryExpression { NodeType: ExpressionType.Not } unary =>
                Negate(TranslateNode(unary.Operand, prefix, mappingInfo)),

            UnaryExpression { NodeType: ExpressionType.Convert or ExpressionType.ConvertChecked } unary =>
                TranslateNode(unary.Operand, prefix, mappingInfo),

            BinaryExpression binary => TranslateBinary(binary, prefix, mappingInfo),

            MethodCallExpression method => TranslateMethodCall(method, prefix, mappingInfo),

            MemberExpression member when IsHasValueAccess(member) =>
                new ExistsQuery { Field = ResolveField(member.Expression!, prefix, mappingInfo).Path },

            MemberExpression member when member.Type == typeof(bool) =>
                new TermQuery { Field = ResolveField(member, prefix, mappingInfo).Path, Value = true },

            MemberExpression member when IsNullableHasValue(member) =>
                new ExistsQuery { Field = ResolveField(member.Expression!, prefix, mappingInfo).Path },

            MemberExpression member when IsNullableValueAccess(member) =>
                TranslateNode(member.Expression!, prefix, mappingInfo),

            _ => throw new NotSupportedException($"Unsupported expression node {node.NodeType}: {node}"),
        };
    }
    #endregion

    #region Dịch biểu thức nhị phân

    /// <summary>
    /// Dịch biểu thức nhị phân
    /// </summary>
    protected virtual Query TranslateBinary(BinaryExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        return node.NodeType switch
        {
            ExpressionType.AndAlso or ExpressionType.And => TranslateAndAlso(node, prefix, mappingInfo),

            ExpressionType.OrElse or ExpressionType.Or => TranslateOrElse(node, prefix, mappingInfo),

            ExpressionType.Equal => TranslateComparison(node, prefix, mappingInfo),

            ExpressionType.NotEqual => TranslateComparison(node, prefix, mappingInfo),

            ExpressionType.GreaterThan or ExpressionType.GreaterThanOrEqual or
            ExpressionType.LessThan or ExpressionType.LessThanOrEqual => TranslateComparison(node, prefix, mappingInfo),

            _ => throw new NotSupportedException($"Unsupported binary operator {node.NodeType}: {node}"),
        };
    }


    /// <summary>
    /// Xây dựng truy vấn And (làm phẳng BoolQuery)
    /// </summary>
    private Query TranslateAndAlso(BinaryExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var filters = new List<Query>();

        // Thu thập tất cả Filter ở phía bên trái
        CollectFilters(node.Left, prefix, mappingInfo, filters);

        // Thu thập Filter ở phía bên phải
        CollectFilters(node.Right, prefix, mappingInfo, filters);

        return new BoolQuery
        {
            Filter = filters.ToArray()
        };
    }

    /// <summary>
    /// Thu thập đệ quy truy vấn Filter
    /// </summary>
    private void CollectFilters(Expression node, string? prefix, IndexMappingInfo? mappingInfo, List<Query> filters)
    {
        if (node is BinaryExpression binary &&
            (binary.NodeType == ExpressionType.AndAlso || binary.NodeType == ExpressionType.And))
        {
            // Thu thập đệ quy các nút con trái và phải
            CollectFilters(binary.Left, prefix, mappingInfo, filters);
            CollectFilters(binary.Right, prefix, mappingInfo, filters);
        }
        else
        {
            // Biểu thức không phải And, dịch trực tiếp và thêm vào danh sách
            var query = TranslateNode(node, prefix, mappingInfo);

            // Nếu kết quả dịch là BoolQuery và có Filter, hãy làm phẳng nó
            if (query.Bool != null && query.Bool.Filter != null && query.Bool.Filter.Count > 0)
            {
                foreach (var subQuery in query.Bool.Filter)
                {
                    filters.Add(subQuery);
                }
            }
            else if (query.Bool != null && query.Bool.Must != null && query.Bool.Must.Count > 0)
            {
                foreach (var subQuery in query.Bool.Must)
                {
                    filters.Add(subQuery);
                }
            }
            else
            {
                filters.Add(query);
            }
        }
    }

    /// <summary>
    /// Xây dựng truy vấn Or (làm phẳng BoolQuery)
    /// </summary>
    private Query TranslateOrElse(BinaryExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var shouldQueries = new List<Query>();

        CollectShouldQueries(node.Left, prefix, mappingInfo, shouldQueries);
        CollectShouldQueries(node.Right, prefix, mappingInfo, shouldQueries);

        return new BoolQuery
        {
            Should = shouldQueries.ToArray(),
            MinimumShouldMatch = 1
        };
    }

    /// <summary>
    /// Thu thập đệ quy truy vấn Should
    /// </summary>
    private void CollectShouldQueries(Expression node, string? prefix, IndexMappingInfo? mappingInfo, List<Query> shouldQueries)
    {
        if (node is BinaryExpression binary &&
            (binary.NodeType == ExpressionType.OrElse || binary.NodeType == ExpressionType.Or))
        {
            CollectShouldQueries(binary.Left, prefix, mappingInfo, shouldQueries);
            CollectShouldQueries(binary.Right, prefix, mappingInfo, shouldQueries);
        }
        else
        {
            var query = TranslateNode(node, prefix, mappingInfo);

            // Nếu kết quả dịch là BoolQuery và có Should, hãy làm phẳng nó
            if (query.Bool != null && query.Bool.Should != null && query.Bool.Should.Count > 0)
            {
                foreach (var subQuery in query.Bool.Should)
                {
                    shouldQueries.Add(subQuery);
                }
            }
            else
            {
                shouldQueries.Add(query);
            }
        }
    }

    /// <summary>
    /// Dịch biểu thức so sánh
    /// </summary>
    protected virtual Query TranslateComparison(BinaryExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var methodCallQuery = TryTranslateMethodComparison(node, prefix, mappingInfo);
        if (methodCallQuery != null)
        {
            return methodCallQuery;
        }

        var (fieldExpression, valueExpression) = ResolveOperands(node);
        var field = ResolveField(fieldExpression, prefix, mappingInfo);

        // Xử lý so sánh null
        if (IsNullConstant(valueExpression))
        {
            return node.NodeType == ExpressionType.NotEqual
                ? new ExistsQuery { Field = field.Path }
                : new BoolQuery
                {
                    MustNot = new Query[] { new ExistsQuery { Field = field.Path } }
                };
        }

        var value = Evaluate(valueExpression);

        if (value == null)
        {
            throw new NotSupportedException("The null value is only supported for the == null / != null comparison.");
        }

        // Xử lý chứa tập hợp
        if (field.Type.IsArray || (field.Type.IsGenericType && typeof(IEnumerable).IsAssignableFrom(field.Type)))
        {
            return BuildTermsQuery(field, value);
        }

        return node.NodeType switch
        {
            ExpressionType.Equal => BuildEquality(field, value),
            ExpressionType.NotEqual => BuildNotEqualQuery(field, value),
            ExpressionType.GreaterThan => BuildRange(field, greaterThan: value),
            ExpressionType.GreaterThanOrEqual => BuildRange(field, greaterThanOrEqualTo: value),
            ExpressionType.LessThan => BuildRange(field, lessThan: value),
            ExpressionType.LessThanOrEqual => BuildRange(field, lessThanOrEqualTo: value),
            _ => throw new NotSupportedException($"Unsupported comparison operator {node.NodeType}"),
        };
    }

    /// <summary>
    /// Phân tích toán hạng, xác định trường và giá trị
    /// </summary>
    private static (Expression Field, Expression Value) ResolveOperands(BinaryExpression node)
    {
        var leftIsField = IsFieldLike(node.Left);
        var rightIsField = IsFieldLike(node.Right);

        if (leftIsField == rightIsField)
        {
            throw new NotSupportedException($"The comparison expression must have one side as a field and the other side as a value: {node}");
        }

        return leftIsField ? (node.Left, node.Right) : (node.Right, node.Left);
    }

    /// <summary>
    /// Kiểm tra biểu thức có phải là trường hay không
    /// </summary>
    private static bool IsFieldLike(Expression expression)
    {
        var current = expression;
        while (current is UnaryExpression { NodeType: ExpressionType.Convert or ExpressionType.ConvertChecked } unary)
        {
            current = unary.Operand;
        }

        while (current is MemberExpression member)
        {
            current = member.Expression!;
        }

        return current is ParameterExpression;
    }

    /// <summary>
    /// Kiểm tra biểu thức có phải là hằng null hay không
    /// </summary>
    private static bool IsNullConstant(Expression expression)
    {
        while (expression is UnaryExpression { NodeType: ExpressionType.Convert or ExpressionType.ConvertChecked } unary)
        {
            expression = unary.Operand;
        }

        return expression is ConstantExpression { Value: null };
    }

    #endregion

    #region Dịch lời gọi phương thức

    /// <summary>
    /// Phủ định truy vấn
    /// </summary>
    private static Query Negate(Query query)
    {
        // Kiểm tra có phải là BoolQuery hay không (thông qua thuộc tính Bool)
        if (query.Bool != null)
        {
            var boolQuery = query.Bool;
            var newBool = new BoolQuery();

            // MustNot -> Must
            if (boolQuery.MustNot != null && boolQuery.MustNot.Count > 0)
            {
                newBool.Must = boolQuery.MustNot.ToArray();
                return newBool;
            }

            // Must -> MustNot
            if (boolQuery.Must != null && boolQuery.Must.Count > 0)
            {
                newBool.MustNot = boolQuery.Must.ToArray();
                return newBool;
            }

            // Filter -> MustNot
            if (boolQuery.Filter != null && boolQuery.Filter.Count > 0)
            {
                newBool.MustNot = boolQuery.Filter.ToArray();
                return newBool;
            }

            // Should -> MustNot
            if (boolQuery.Should != null && boolQuery.Should.Count > 0)
            {
                newBool.MustNot = boolQuery.Should.ToArray();
                return newBool;
            }

            // BoolQuery rỗng -> MatchAll
            return new MatchAllQuery();
        }

        // Đối với ExistsQuery, sau khi phủ định sẽ thành MustNot + Exists
        if (query.Exists != null)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { query.Exists }
            };
        }

        // Đối với MatchAllQuery, sau khi phủ định sẽ thành MatchNoneQuery
        if (query.MatchAll != null)
        {
            return new MatchNoneQuery();
        }

        // Đối với MatchNoneQuery, sau khi phủ định sẽ thành MatchAllQuery
        if (query.MatchNone != null)
        {
            return new MatchAllQuery();
        }

        // Đối với TermQuery, sau khi phủ định sẽ thành MustNot + Term
        if (query.Term != null)
        {
            if (query.Term.Value.IsBool && query.Term.Value.TryGetBool(out var boolValue))
            {
                return new TermQuery
                {
                    Field = query.Term.Field,
                    Value = FieldValue.FromValue(!boolValue)
                };
            }
            return new BoolQuery
            {
                MustNot = new Query[] { query.Term }
            };
        }

        // Đối với WildcardQuery, sau khi phủ định sẽ thành MustNot + Wildcard
        if (query.Wildcard != null)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { query.Wildcard }
            };
        }

        // Đối với MatchQuery, sau khi phủ định sẽ thành MustNot + Match
        if (query.Match != null)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { query.Match }
            };
        }

        // Đối với MatchPhraseQuery, sau khi phủ định sẽ thành MustNot + MatchPhrase
        if (query.MatchPhrase != null)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { query.MatchPhrase }
            };
        }

        // Đối với MatchPhrasePrefixQuery, sau khi phủ định sẽ thành MustNot + MatchPhrasePrefix
        if (query.MatchPhrasePrefix != null)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { query.MatchPhrasePrefix }
            };
        }

        // Đối với NumberRangeQuery
        if (query.Range != null && query.Range is NumberRangeQuery numberRange)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { numberRange }
            };
        }

        // Đối với DateRangeQuery
        if (query.Range != null && query.Range is DateRangeQuery dateRange)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { dateRange }
            };
        }

        // Đối với TermsQuery
        if (query.Terms != null)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { query.Terms }
            };
        }

        // Đối với NestedQuery
        if (query.Nested != null)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { query.Nested }
            };
        }

        // Đối với ScriptQuery
        if (query.Script != null)
        {
            return new BoolQuery
            {
                MustNot = new Query[] { query.Script }
            };
        }

        // Mặc định: đối với kiểu chưa biết, dùng MustNot để bao bọc
        return new BoolQuery
        {
            MustNot = new Query[] { query }
        };
    }

    /// <summary>
    /// Dịch biểu thức gọi phương thức
    /// </summary>
    protected virtual Query TranslateMethodCall(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        // Enumerable.Any / Enumerable.Contains / Enumerable.All
        if (node.Method.DeclaringType == typeof(Enumerable))
        {
            return TranslateEnumerableMethod(node, prefix, mappingInfo);
        }

        // Phương thức chuỗi
        if (node.Method.DeclaringType == typeof(string))
        {
            return TranslateStringMethod(node, prefix, mappingInfo);
        }

        // Enum.HasFlag
        if (node.Method.Name == nameof(Enum.HasFlag))
        {
            return TranslateEnumHasFlag(node, prefix, mappingInfo);
        }

        // List/Collection.Contains (phương thức thể hiện)
        if (node.Method.Name == nameof(ICollection<>.Contains) && node.Object != null)
        {
            return TranslateCollectionContains(node, prefix, mappingInfo);
        }

        throw new NotSupportedException(
            $"Unsupported method invocation {node.Method.DeclaringType?.Name}.{node.Method.Name}");
    }

    #endregion

    #region Xây dựng truy vấn

    /// <summary>
    /// Xây dựng truy vấn bằng nhau
    /// </summary>
    protected virtual Query BuildEquality(FieldInfo field, object value)
    {
        var fieldName = field.Path;

        // 1. Trường Wildcard - dùng truy vấn Term
        if (field.IsWildcard)
        {
            return new TermQuery
            {
                Field = fieldName,
                Value = value.ToString()!
            };
        }

        // 2. Trường Keyword hoặc chuỗi
        if (field.IsKeyword || field.Type == typeof(string))
        {
            // Nếu là kiểu enum được lưu dưới dạng chuỗi, cần chuyển đổi một chút
            var stringValue = field.Type.IsEnum
                ? NormalizeEnumName(field.Type, value)
                : value.ToString()!;
            return new TermQuery { Field = fieldName, Value = stringValue };
        }

        // 3. Trường ngày tháng
        if (field.IsDate || field.Type == typeof(DateTime) || field.Type == typeof(DateTime?))
        {
            var date = (DateTime)value;
            return new DateRangeQuery
            {
                Field = fieldName,
                Gte = date,
                Lte = date,
                Format = field.Format ?? "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
            };
        }

        // 4. Trường số
        if (field.IsNumeric || IsNumericType(field.Type))
        {
            return new TermQuery { Field = fieldName, Value = NormalizeValue(value) };
        }

        // 5. Trường boolean
        if (field.IsBoolean || field.Type == typeof(bool) || field.Type == typeof(bool?))
        {
            return new TermQuery { Field = fieldName, Value = (bool)value };
        }

        // 6. Enum (giá trị dưới dạng số)
        if (field.Type.IsEnum)
        {
            return new TermQuery { Field = fieldName, Value = Convert.ToInt64(value) };
        }

        // 7. Nếu giá trị là enum nhưng kiểu trường không phải enum
        if (value.GetType().IsEnum)
        {
            return new TermQuery { Field = fieldName, Value = Convert.ToInt64(value) };
        }

        // 8. Trường Text - dùng MatchQuery
        if (field.IsText)
        {
            return new MatchQuery
            {
                Field = fieldName,
                Query = value.ToString()!
            };
        }

        // 9. Mặc định
        return new TermQuery { Field = fieldName, Value = NormalizeValue(value) };
    }

    /// <summary>
    /// Xây dựng truy vấn NotEqual
    /// </summary>
    private Query BuildNotEqualQuery(FieldInfo field, object value)
    {
        // Đối với giá trị boolean, phủ định trực tiếp giá trị (ngắn gọn hơn)
        if (value is bool boolValue)
        {
            return new TermQuery { Field = field.Path, Value = !boolValue };
        }

        // Đối với các kiểu khác, dùng must_not để bao bọc
        return new BoolQuery
        {
            MustNot = new Query[] { BuildEquality(field, value) }
        };
    }

    /// <summary>
    /// Xây dựng truy vấn Terms (dùng cho chứa tập hợp)
    /// </summary>
    protected virtual Query BuildTermsQuery(FieldInfo field, object value)
    {
        var fieldName = field.Path;

        if (value is IEnumerable enumerable && value is not string)
        {
            var values = enumerable.Cast<object>().Select(NormalizeValue).ToList();
            if (values.Count == 0)
            {
                return new MatchNoneQuery();
            }
            if (values.Count == 1)
            {
                return BuildEquality(field, values[0]);
            }
            return new TermsQuery { Field = fieldName, Terms = new TermsQueryField(values) };
        }

        return BuildEquality(field, value);
    }

    /// <summary>
    /// Xây dựng truy vấn khoảng
    /// </summary>
    protected virtual Query BuildRange(
        FieldInfo field,
        object? greaterThan = null,
        object? greaterThanOrEqualTo = null,
        object? lessThan = null,
        object? lessThanOrEqualTo = null)
    {
        var fieldName = field.Path;

        // Khoảng ngày tháng
        if (field.IsDate || field.Type == typeof(DateTime) || field.Type == typeof(DateTime?))
        {
            var range = new DateRangeQuery
            {
                Field = fieldName,
                Format = field.Format ?? "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
            };

            if (greaterThan != null)
            {
                range.Gt = DateMath.FromString(NormalizeDate(greaterThan));
            }
            if (greaterThanOrEqualTo != null)
            {
                range.Gte = DateMath.FromString(NormalizeDate(greaterThanOrEqualTo));
            }
            if (lessThan != null)
            {
                range.Lt = DateMath.FromString(NormalizeDate(lessThan));
            }
            if (lessThanOrEqualTo != null)
            {
                range.Lte = DateMath.FromString(NormalizeDate(lessThanOrEqualTo));
            }

            return range;
        }

        // Khoảng số
        var numberRange = new NumberRangeQuery { Field = fieldName };

        if (greaterThan != null)
        {
            numberRange.Gt = ToNumber(greaterThan);
        }
        if (greaterThanOrEqualTo != null)
        {
            numberRange.Gte = ToNumber(greaterThanOrEqualTo);
        }
        if (lessThan != null)
        {
            numberRange.Lt = ToNumber(lessThan);
        }
        if (lessThanOrEqualTo != null)
        {
            numberRange.Lte = ToNumber(lessThanOrEqualTo);
        }

        return numberRange;
    }


    #endregion

    #region Phương thức hỗ trợ

    /// <summary>
    /// Mở gói biểu thức Lambda
    /// </summary>
    private static LambdaExpression UnwrapLambda(Expression expression)
    {
        while (expression is UnaryExpression { NodeType: ExpressionType.Quote } unary)
        {
            expression = unary.Operand;
        }
        return (LambdaExpression)expression;
    }

    /// <summary>
    /// Đánh giá biểu thức
    /// </summary>
    private static object? Evaluate(Expression expression)
    {
        // Nếu là biểu thức hằng, trả về trực tiếp giá trị
        if (expression is ConstantExpression constant)
        {
            return constant.Value;
        }

        // Nếu là biểu thức tham số, không thể đánh giá
        if (expression is ParameterExpression)
        {
            throw new InvalidOperationException($"Cannot evaluate parameter expression: {expression}");
        }

        // Xử lý truy cập thành viên (bắt biến bên ngoài)
        if (expression is MemberExpression memberExpr)
        {
            // Kiểm tra có phải là truy cập trường hoặc thuộc tính hay không
            if (memberExpr.Member is System.Reflection.FieldInfo fieldInfo)
            {
                // Nếu là trường tĩnh
                if (fieldInfo.IsStatic)
                {
                    return fieldInfo.GetValue(null);
                }

                // Nếu là trường thể hiện, cần đánh giá thể hiện trước
                if (memberExpr.Expression != null)
                {
                    var obj = Evaluate(memberExpr.Expression);
                    if (obj != null)
                    {
                        return fieldInfo.GetValue(obj);
                    }
                }

                // Nếu không thể đánh giá, thử biên dịch toàn bộ biểu thức
                try
                {
                    return Expression.Lambda(memberExpr).Compile().DynamicInvoke();
                }
                catch
                {
                    throw new InvalidOperationException($"Cannot evaluate member expression: {memberExpr}");
                }
            }

            if (memberExpr.Member is PropertyInfo propertyInfo)
            {
                // Nếu là thuộc tính tĩnh
                var getMethod = propertyInfo.GetGetMethod();
                if (getMethod != null && getMethod.IsStatic)
                {
                    return propertyInfo.GetValue(null);
                }

                // Nếu là thuộc tính thể hiện, cần đánh giá thể hiện trước
                if (memberExpr.Expression != null)
                {
                    var obj = Evaluate(memberExpr.Expression);
                    if (obj != null)
                    {
                        return propertyInfo.GetValue(obj);
                    }
                }

                // Nếu không thể đánh giá, thử biên dịch toàn bộ biểu thức
                try
                {
                    return Expression.Lambda(memberExpr).Compile().DynamicInvoke();
                }
                catch
                {
                    throw new InvalidOperationException($"Cannot evaluate member expression: {memberExpr}");
                }
            }
        }

        // Xử lý chỉ số mảng
        if (expression is IndexExpression indexExpr)
        {
            var obj = Evaluate(indexExpr.Object!);
            var indices = indexExpr.Arguments.Select(Evaluate).ToArray();
            if (obj is Array array && indices.Length == 1 && indices[0] is int index)
            {
                return array.GetValue(index);
            }
        }

        // Xử lý lời gọi phương thức
        if (expression is MethodCallExpression methodCall)
        {
            try
            {
                // Thử biên dịch và thực thi
                var lambda = Expression.Lambda(methodCall);
                return lambda.Compile().DynamicInvoke();
            }
            catch (InvalidOperationException)
            {
                // Nếu chứa tham chiếu tham số, không thể biên dịch
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Cannot evaluate method call: {methodCall}", ex);
            }
        }

        // Xử lý NewArrayExpression
        if (expression is NewArrayExpression newArray)
        {
            var values = newArray.Expressions.Select(Evaluate).ToArray();
            return values;
        }

        // Mặc định thử biên dịch và thực thi

        return Expression.Lambda(expression).Compile().DynamicInvoke();
    }

    /// <summary>
    /// Thoát ký tự đại diện
    /// </summary>
    private static string EscapeWildcard(string value)
    {
        return value.Replace("\\", "\\\\").Replace("*", "\\*").Replace("?", "\\?");
    }

    /// <summary>
    /// Chuẩn hóa giá trị
    /// </summary>
    private static FieldValue NormalizeValue(object value)
    {
        return value switch
        {
            string s => s,
            bool b => b,
            int i => i,
            long l => l,
            double d => d,
            float f => f,
            decimal dec => Convert.ToDouble(dec),
            Guid g => g.ToString(),
            Enum e => Convert.ToInt64(e),
            DateTime dt => NormalizeDate(dt),
            DateTimeOffset dto => NormalizeDate(dto),
            _ => Convert.ToDouble(value)
        };
    }

    /// <summary>
    /// Chuẩn hóa giá trị ngày tháng
    /// </summary>
    private static string NormalizeDate(object value)
    {
        if (value is DateTime dateTime)
        {
            // Định dạng thành định dạng Elasticsearch hỗ trợ (không kèm múi giờ)
            return dateTime.ToString("yyyy-MM-dd HH:mm:ss");
        }

        if (value is DateTimeOffset dateTimeOffset)
        {
            return dateTimeOffset.ToString("yyyy-MM-dd HH:mm:ss");
        }

        return value.ToString()!;
    }
    /// <summary>
    /// Chuyển đổi thành Number
    /// </summary>
    private static Number? ToNumber(object? value)
    {
        return value == null
            ? null
            : value switch
        {
            Number n => n,
            sbyte v => (Number)v,
            byte v => (Number)v,
            short v => (Number)v,
            ushort v => (Number)v,
            int v => (Number)v,
            uint v => (Number)v,
            long v => (Number)v,
            ulong v => (Number)v,
            float v => (Number)v,
            double v => (Number)v,
            decimal v => (Number)(double)v,
            _ => (Number)Convert.ToDouble(value)
        };
    }

    /// <summary>
    /// Chuẩn hóa tên enum
    /// </summary>
    private static string NormalizeEnumName(Type enumType, object value)
    {
        var enumValue = value is Enum e
            ? e
            : (Enum)Enum.ToObject(enumType, value);
        return enumValue.ToString();
    }

    /// <summary>
    /// Kiểm tra có phải là kiểu số hay không
    /// </summary>
    private static bool IsNumericType(Type type)
    {
        var underlyingType = Nullable.GetUnderlyingType(type) ?? type;
        return underlyingType == typeof(byte) || underlyingType == typeof(sbyte) ||
               underlyingType == typeof(short) || underlyingType == typeof(ushort) ||
               underlyingType == typeof(int) || underlyingType == typeof(uint) ||
               underlyingType == typeof(long) || underlyingType == typeof(ulong) ||
               underlyingType == typeof(float) || underlyingType == typeof(double) ||
               underlyingType == typeof(decimal);
    }

    /// <summary>
    /// Kiểm tra có phải là truy cập Nullable.HasValue hay không
    /// </summary>
    private static bool IsNullableHasValue(MemberExpression member)
    {
        return member.Member.Name == nameof(Nullable<>.HasValue)
               && member.Expression is MemberExpression
               && member.Member.DeclaringType?.IsGenericType == true
               && member.Member.DeclaringType.GetGenericTypeDefinition() == typeof(Nullable<>);
    }

    /// <summary>
    /// Kiểm tra có phải là truy cập Nullable.Value hay không
    /// </summary>
    private static bool IsNullableValueAccess(MemberExpression member)
    {
        return member.Member.Name == nameof(Nullable<>.Value)
               && member.Expression is MemberExpression
               && member.Member.DeclaringType?.IsGenericType == true
               && member.Member.DeclaringType.GetGenericTypeDefinition() == typeof(Nullable<>);
    }

    private static bool IsHasValueAccess(MemberExpression member)
    {
        return IsNullableHasValue(member);
    }

    #endregion
}