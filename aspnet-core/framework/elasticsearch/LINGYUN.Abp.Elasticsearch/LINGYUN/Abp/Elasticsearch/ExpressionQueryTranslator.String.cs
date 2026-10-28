using Elastic.Clients.Elasticsearch.QueryDsl;
using System;
using System.Linq.Expressions;

namespace LINGYUN.Abp.Elasticsearch;

public partial class ExpressionQueryTranslator
{
    /// <summary>
    /// Dịch phương thức chuỗi
    /// </summary>
    private Query TranslateStringMethod(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        return node.Method.Name switch
        {
            // Phương thức thể hiện
            nameof(string.Contains) => TranslateStringContains(node, prefix, mappingInfo),
            nameof(string.StartsWith) => TranslateStringStartsWith(node, prefix, mappingInfo),
            nameof(string.EndsWith) => TranslateStringEndsWith(node, prefix, mappingInfo),
            nameof(string.Equals) => TranslateStringEquals(node, prefix, mappingInfo),
            nameof(string.CompareTo) => TranslateStringCompareTo(node, prefix, mappingInfo),
            nameof(string.IndexOf) => TranslateStringIndexOf(node, prefix, mappingInfo),

            // Phương thức tĩnh
            nameof(string.IsNullOrEmpty) => TranslateStringIsNullOrEmpty(node, prefix, mappingInfo),
            nameof(string.IsNullOrWhiteSpace) => TranslateStringIsNullOrWhiteSpace(node, prefix, mappingInfo),

            // Các phương thức khác không được hỗ trợ
            _ => throw new NotSupportedException($"Unsupported string method {node.Method.Name}"),
        };
    }

    /// <summary>
    /// Dịch Contains
    /// </summary>
    private Query TranslateStringContains(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var (field, value) = GetStringMethodOperands(node, prefix, mappingInfo);
        var fieldMapping = mappingInfo?.GetField(field.Path);
        return TranslateStringContains(field, fieldMapping, value);
    }

    /// <summary>
    /// Dịch StartsWith
    /// </summary>
    private Query TranslateStringStartsWith(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var (field, value) = GetStringMethodOperands(node, prefix, mappingInfo);
        var fieldMapping = mappingInfo?.GetField(field.Path);
        return TranslateStartsWith(field, fieldMapping, value);
    }

    /// <summary>
    /// Dịch EndsWith
    /// </summary>
    private Query TranslateStringEndsWith(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var (field, value) = GetStringMethodOperands(node, prefix, mappingInfo);
        var fieldMapping = mappingInfo?.GetField(field.Path);
        return TranslateEndsWith(field, fieldMapping, value);
    }

    /// <summary>
    /// Dịch StartsWith
    /// </summary>
    private Query TranslateStartsWith(FieldInfo field, FieldMappingInfo? fieldMapping, string value)
    {
        var pattern = EscapeWildcard(value) + "*";

        // Kiểu Wildcard
        if (field.IsWildcard || fieldMapping?.IsWildcard == true)
        {
            return new WildcardQuery { Field = field.Path, Value = pattern };
        }

        // Kiểu Keyword hoặc Text có trường con keyword
        if (field.IsKeyword || fieldMapping?.IsKeyword == true ||
            (fieldMapping?.IsText == true && fieldMapping?.Properties?.ContainsKey("keyword") == true))
        {
            var fieldPath = fieldMapping?.IsText == true && fieldMapping?.Properties?.ContainsKey("keyword") == true
                ? $"{field.Path}.keyword"
                : field.Path;
            return new WildcardQuery { Field = fieldPath, Value = pattern };
        }

        // Kiểu Text không có trường con keyword
        if (field.IsText || fieldMapping?.IsText == true)
        {
            return new MatchPhrasePrefixQuery
            {
                Field = field.Path,
                Query = value
            };
        }

        return new WildcardQuery { Field = field.Path, Value = pattern };
    }

    /// <summary>
    /// Dịch EndsWith
    /// </summary>
    private Query TranslateEndsWith(FieldInfo field, FieldMappingInfo? fieldMapping, string value)
    {
        var pattern = "*" + EscapeWildcard(value);

        // Kiểu Wildcard
        if (field.IsWildcard || fieldMapping?.IsWildcard == true)
        {
            return new WildcardQuery { Field = field.Path, Value = pattern };
        }

        // Kiểu Keyword hoặc Text có trường con keyword
        if (field.IsKeyword || fieldMapping?.IsKeyword == true ||
            (fieldMapping?.IsText == true && fieldMapping?.Properties?.ContainsKey("keyword") == true))
        {
            var fieldPath = fieldMapping?.IsText == true && fieldMapping?.Properties?.ContainsKey("keyword") == true
                ? $"{field.Path}.keyword"
                : field.Path;
            return new WildcardQuery { Field = fieldPath, Value = pattern };
        }

        // Kiểu Text không có trường con keyword
        if (field.IsText || fieldMapping?.IsText == true)
        {
            return new MatchPhraseQuery
            {
                Field = field.Path,
                Query = value
            };
        }

        return new WildcardQuery { Field = field.Path, Value = pattern };
    }

    /// <summary>
    /// Dịch string.Equals
    /// </summary>
    private Query TranslateStringEquals(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var (field, value) = GetStringMethodOperands(node, prefix, mappingInfo);

        if (string.IsNullOrEmpty(value))
        {
            return new BoolQuery { MustNot = new Query[] { new ExistsQuery { Field = field.Path } } };
        }

        return BuildEquality(field, value);
    }

    /// <summary>
    /// Dịch string.CompareTo
    /// </summary>
    private Query TranslateStringCompareTo(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var (field, value) = GetStringMethodOperands(node, prefix, mappingInfo);

        // CompareTo thường dùng để so sánh, ở đây đơn giản hóa thành so sánh bằng
        // Nếu cần logic so sánh phức tạp hơn, có thể mở rộng tại đây
        return BuildEquality(field, value);
    }

    /// <summary>
    /// Dịch string.IndexOf
    /// </summary>
    private Query TranslateStringIndexOf(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var (field, value) = GetStringMethodOperands(node, prefix, mappingInfo);
        var fieldMapping = mappingInfo?.GetField(field.Path);

        // IndexOf >= 0 tương đương với Contains
        return TranslateStringContains(field, fieldMapping, value);
    }

    /// <summary>
    /// Dịch Contains
    /// </summary>
    private Query TranslateStringContains(FieldInfo field, FieldMappingInfo? fieldMapping, string value)
    {
        // 1. Kiểu Wildcard - dùng trực tiếp truy vấn ký tự đại diện (tối ưu nhất)
        if (field.IsWildcard || fieldMapping?.IsWildcard == true)
        {
            return new WildcardQuery
            {
                Field = field.Path,
                Value = "*" + EscapeWildcard(value) + "*"
            };
        }

        // 2. Kiểu Keyword - dùng truy vấn ký tự đại diện
        if (field.IsKeyword || fieldMapping?.IsKeyword == true)
        {
            return new WildcardQuery
            {
                Field = field.Path,
                Value = "*" + EscapeWildcard(value) + "*"
            };
        }

        // 3. Kiểu Text
        if (field.IsText || fieldMapping?.IsText == true)
        {
            // 3.1 Nếu có trường con keyword, dùng .keyword để truy vấn ký tự đại diện
            if (fieldMapping?.Properties?.ContainsKey("keyword") == true)
            {
                return new WildcardQuery
                {
                    Field = $"{field.Path}.keyword",
                    Value = "*" + EscapeWildcard(value) + "*"
                };
            }

            // 3.2 Không có trường con keyword, dùng MatchPhrase để tìm kiếm toàn văn
            // Lưu ý: đây không phải Contains chính xác mà là khớp cụm từ sau khi tách từ
            return new MatchPhraseQuery
            {
                Field = field.Path,
                Query = value
            };
        }

        // 4. Mặc định - thử dùng ký tự đại diện
        return new WildcardQuery
        {
            Field = field.Path,
            Value = "*" + EscapeWildcard(value) + "*"
        };
    }

    /// <summary>
    /// Dịch string.IsNullOrEmpty
    /// </summary>
    private Query TranslateStringIsNullOrEmpty(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var field = ResolveField(node.Arguments[0], prefix, mappingInfo);

        // field == null || field == ""
        return new BoolQuery
        {
            Should = new Query[]
            {
                // null hoặc không tồn tại
                new BoolQuery
                {
                    MustNot = new Query[] { new ExistsQuery { Field = field.Path } }
                },
                // Chuỗi rỗng
                new TermQuery
                {
                    Field = field.Path,
                    Value = string.Empty
                }
            },
            MinimumShouldMatch = 1
        };
    }

    /// <summary>
    /// Dịch string.IsNullOrWhiteSpace
    /// </summary>
    private Query TranslateStringIsNullOrWhiteSpace(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var field = ResolveField(node.Arguments[0], prefix, mappingInfo);

        // field == null || field == "" || Regex.IsMatch(field, @"^\s*$")
        return new BoolQuery
        {
            Should = new Query[]
            {
                // null hoặc không tồn tại
                new BoolQuery
                {
                    MustNot = new Query[] { new ExistsQuery { Field = field.Path } }
                },
                // Chuỗi rỗng
                new TermQuery
                {
                    Field = field.Path,
                    Value = string.Empty
                },
                // Dùng biểu thức chính quy để khớp chuỗi chỉ chứa ký tự trắng
                new RegexpQuery
                {
                    Field = field.Path,
                    Value = @"^\s*$"
                }
            },
            MinimumShouldMatch = 1
        };
    }

    /// <summary>
    /// Dịch phép so sánh string.CompareTo
    /// </summary>
    private Query? TranslateStringCompareToComparison(
        MethodCallExpression methodCall,
        Expression constantExpression,
        ExpressionType comparisonType,
        string? prefix,
        IndexMappingInfo? mappingInfo)
    {
        var (field, compareValue) = GetStringMethodOperands(methodCall, prefix, mappingInfo);
        var compareResult = Convert.ToInt32(Evaluate(constantExpression));

        switch (comparisonType)
        {
            case ExpressionType.Equal when compareResult == 0:
                // CompareTo == 0 nghĩa là bằng nhau
                return BuildEquality(field, compareValue);

            case ExpressionType.NotEqual when compareResult == 0:
                // CompareTo != 0 nghĩa là không bằng nhau
                return BuildNotEqualQuery(field, compareValue);

            case ExpressionType.GreaterThan when compareResult == 0:
                // CompareTo > 0 nghĩa là giá trị trường hiện tại lớn hơn giá trị so sánh
                return BuildRange(field, greaterThan: compareValue);

            case ExpressionType.GreaterThanOrEqual when compareResult == 0:
                // CompareTo >= 0 nghĩa là giá trị trường hiện tại lớn hơn hoặc bằng giá trị so sánh
                return BuildRange(field, greaterThanOrEqualTo: compareValue);

            case ExpressionType.LessThan when compareResult == 0:
                // CompareTo < 0 nghĩa là giá trị trường hiện tại nhỏ hơn giá trị so sánh
                return BuildRange(field, lessThan: compareValue);

            case ExpressionType.LessThanOrEqual when compareResult == 0:
                // CompareTo <= 0 nghĩa là giá trị trường hiện tại nhỏ hơn hoặc bằng giá trị so sánh
                return BuildRange(field, lessThanOrEqualTo: compareValue);

            default:
                return null;
        }
    }

    /// <summary>
    /// Dịch phép so sánh string.IndexOf
    /// </summary>
    private Query? TranslateStringIndexOfComparison(
        MethodCallExpression methodCall,
        Expression constantExpression,
        ExpressionType comparisonType,
        string? prefix,
        IndexMappingInfo? mappingInfo)
    {
        // Lấy trường và giá trị tìm kiếm
        var (field, searchValue) = GetStringMethodOperands(methodCall, prefix, mappingInfo);
        var indexResult = Convert.ToInt32(Evaluate(constantExpression));
        var fieldMapping = mappingInfo?.GetField(field.Path);

        switch (comparisonType)
        {
            case ExpressionType.GreaterThanOrEqual when indexResult >= 0:
            case ExpressionType.GreaterThan when indexResult > -1:
            case ExpressionType.NotEqual when indexResult == -1:
                // IndexOf >= 0, IndexOf > -1, IndexOf != -1 nghĩa là chứa
                return TranslateStringContains(field, fieldMapping, searchValue);

            case ExpressionType.LessThan when indexResult <= 0:
            case ExpressionType.Equal when indexResult == -1:
                // IndexOf == -1, IndexOf < 0 nghĩa là không chứa
                var containsQuery = TranslateStringContains(field, fieldMapping, searchValue);
                return new BoolQuery
                {
                    MustNot = new Query[] { containsQuery }
                };

            default:
                return null;
        }
    }

    /// <summary>
    /// Dịch phương thức thể hiện của chuỗi (lấy trường và giá trị)
    /// </summary>
    private (FieldInfo Field, string Value) GetStringMethodOperands(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        Expression fieldExpression;
        Expression valueExpression;

        if (node.Object != null)
        {
            // Phương thức thể hiện: obj.Method(value)
            fieldExpression = node.Object;
            valueExpression = node.Arguments[0];
        }
        else
        {
            // Phương thức tĩnh: string.Method(field, value)
            fieldExpression = node.Arguments[0];
            valueExpression = node.Arguments.Count > 1 ? node.Arguments[1] : node.Arguments[0];
        }

        var field = ResolveField(fieldExpression, prefix, mappingInfo);
        var value = Evaluate(valueExpression)?.ToString() ?? string.Empty;

        return (field, value);
    }
}
