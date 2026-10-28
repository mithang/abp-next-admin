using Elastic.Clients.Elasticsearch.QueryDsl;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace LINGYUN.Abp.Elasticsearch;

public partial class ExpressionQueryTranslator
{
    /// <summary>
    /// Dịch phương thức Enumerable
    /// </summary>
    private Query TranslateEnumerableMethod(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        switch (node.Method.Name)
        {
            case nameof(Enumerable.Any):
                return TranslateEnumerableAny(node, prefix, mappingInfo);

            case nameof(Enumerable.Contains):
                return TranslateEnumerableContains(node, prefix, mappingInfo);

            case nameof(Enumerable.All):
                return TranslateEnumerableAll(node, prefix, mappingInfo);

            default:
                throw new NotSupportedException($"Unsupported Enumerable method {node.Method.Name}");
        }
    }

    /// <summary>
    /// Dịch Enumerable.Any
    /// </summary>
    private Query TranslateEnumerableAny(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var collectionField = ResolveField(node.Arguments[0], prefix, mappingInfo);

        Query inner;
        if (node.Arguments.Count == 1)
        {
            // .Any() kiểm tra tập hợp có tồn tại hay không
            inner = new ExistsQuery { Field = collectionField.Path };
        }
        else
        {
            // .Any(predicate)
            var predicate = UnwrapLambda(node.Arguments[1]);
            inner = TranslateNode(predicate.Body, prefix: collectionField.Path, mappingInfo);
        }

        var shouldUseNested = collectionField.IsNested || (mappingInfo?.IsNested(collectionField.Path) ?? false);

        return shouldUseNested
            ? new NestedQuery(collectionField.Path, inner)
            : inner;
    }

    /// <summary>
    /// Dịch Enumerable.Contains
    /// </summary>
    private Query TranslateEnumerableContains(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        Expression collectionExpr;
        Expression valueExpr;

        if (node.Object != null)
        {
            // list.Contains(value)
            collectionExpr = node.Object;
            valueExpr = node.Arguments[0];
        }
        else
        {
            // Enumerable.Contains(list, value)
            collectionExpr = node.Arguments[0];
            valueExpr = node.Arguments[1];
        }

        var field = ResolveField(collectionExpr, prefix, mappingInfo);
        var value = Evaluate(valueExpr);

        return BuildTermsQuery(field, value!);
    }

    /// <summary>
    /// Dịch Enumerable.All
    /// </summary>
    private Query TranslateEnumerableAll(MethodCallExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var collectionField = ResolveField(node.Arguments[0], prefix, mappingInfo);
        var predicate = UnwrapLambda(node.Arguments[1]);

        var inner = TranslateNode(predicate.Body, prefix: collectionField.Path, mappingInfo);

        return new NestedQuery(collectionField.Path, inner);
    }
}
