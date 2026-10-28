using Elastic.Clients.Elasticsearch.QueryDsl;
using System;
using System.Collections;
using System.Linq;
using System.Linq.Expressions;

namespace LINGYUN.Abp.Elasticsearch;

public partial class ExpressionQueryTranslator
{
    /// <summary>
    /// Dịch Contains của tập hợp
    /// </summary>
    private Query TranslateCollectionContains(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        // list.Contains(value) hoặc hashSet.Contains(value)
        // Có hai trường hợp:
        // 1. Tập hợp bên ngoài.Contains(trường) - ví dụ: new[]{"a","b"}.Contains(x.xxx)
        // 2. Trường.Contains(giá trị) - ví dụ: x.Y.Contains("B")

        Expression collectionExpr = node.Object!;
        Expression valueExpr = node.Arguments[0];

        // Xác định đâu là trường, đâu là giá trị
        var collectionIsField = IsFieldLike(collectionExpr);
        var valueIsField = IsFieldLike(valueExpr);

        if (collectionIsField && !valueIsField)
        {
            // Trường hợp 2: Trường.Contains(giá trị)
            // Thường dùng cho trường tập hợp, ví dụ x.Tags.Contains("B")
            var field = ResolveField(collectionExpr, prefix, mappingInfo);
            var value = Evaluate(valueExpr);

            if (value == null)
            {
                return new MatchNoneQuery();
            }

            // Đối với trường tập hợp, dùng truy vấn Terms hoặc truy vấn Term
            // Nếu trường là kiểu mảng hoặc tập hợp, Contains với một giá trị đơn thực chất chính là truy vấn Term
            return BuildEquality(field, value);
        }
        else if (!collectionIsField && valueIsField)
        {
            // Trường hợp 1: Tập hợp bên ngoài.Contains(trường)
            var field = ResolveField(valueExpr, prefix, mappingInfo);

            // Thử lấy giá trị của tập hợp
            var collectionValue = Evaluate(collectionExpr);

            if (collectionValue is IEnumerable enumerable && collectionValue is not string)
            {
                var values = enumerable.Cast<object>().Select(NormalizeValue).ToList();
                if (values.Count == 0)
                {
                    return new MatchNoneQuery();
                }
                if (values.Count == 1)
                {
                    // Nếu tập hợp chỉ có một giá trị, dùng TermQuery
                    return BuildEquality(field, values[0]);
                }
                // Nhiều giá trị dùng TermsQuery
                return new TermsQuery { Field = field.Path, Terms = new TermsQueryField(values) };
            }

            // Nếu không lấy được giá trị tập hợp, dùng cách xử lý mặc định
            var defaultValue = Evaluate(valueExpr);
            return BuildEquality(field, defaultValue!);
        }
        else if (collectionIsField && valueIsField)
        {
            // Cả hai đều là trường, trường hợp này ít gặp
            throw new NotSupportedException($"Unsupported Contains with two field expressions: {node}");
        }
        else
        {
            // Cả hai đều không phải trường, thử tính trực tiếp
            var collectionValue = Evaluate(collectionExpr);
            var value = Evaluate(valueExpr);

            if (collectionValue is IEnumerable enumerable && collectionValue is not string)
            {
                if (enumerable.Cast<object>().Contains(value))
                {
                    return new MatchAllQuery();
                }
                else
                {
                    return new MatchNoneQuery();
                }
            }

            throw new NotSupportedException($"Unsupported Contains expression: {node}");
        }
    }
}
