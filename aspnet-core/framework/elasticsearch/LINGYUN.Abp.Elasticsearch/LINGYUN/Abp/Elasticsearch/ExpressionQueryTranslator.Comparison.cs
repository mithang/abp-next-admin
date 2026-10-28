using Elastic.Clients.Elasticsearch.QueryDsl;
using System;
using System.Linq.Expressions;

namespace LINGYUN.Abp.Elasticsearch;

public partial class ExpressionQueryTranslator
{
    /// <summary>
    /// Thử dịch biểu thức so sánh chứa lời gọi phương thức
    /// </summary>
    private Query? TryTranslateMethodComparison(BinaryExpression node, string? prefix, IndexMappingInfo? mappingInfo)
    {
        // Xử lý các biểu thức dạng (field.Method(value) == 0) hoặc (field.Method(value) >= 0)
        if (node.Left is MethodCallExpression leftMethodCall)
        {
            return TranslateMethodComparison(leftMethodCall, node.Right, node.NodeType, prefix, mappingInfo);
        }

        // Xử lý các biểu thức dạng (0 == field.Method(value)) hoặc (0 <= field.Method(value))
        if (node.Right is MethodCallExpression rightMethodCall)
        {
            // Đảo ngược toán tử so sánh
            var reversedNodeType = ReverseComparisonOperator(node.NodeType);
            return TranslateMethodComparison(rightMethodCall, node.Left, reversedNodeType, prefix, mappingInfo);
        }

        return null;
    }

    /// <summary>
    /// Dịch phép so sánh lời gọi phương thức
    /// </summary>
    private Query? TranslateMethodComparison(
        MethodCallExpression methodCall,
        Expression constantExpression,
        ExpressionType comparisonType,
        string? prefix,
        IndexMappingInfo? mappingInfo)
    {
        // Giới hạn lời gọi phương thức string
        if (methodCall.Method.DeclaringType == typeof(string))
        {
            return methodCall.Method.Name switch
            {
                nameof(string.CompareTo) => TranslateStringCompareToComparison(methodCall, constantExpression, comparisonType, prefix, mappingInfo),
                nameof(string.IndexOf) => TranslateStringIndexOfComparison(methodCall, constantExpression, comparisonType, prefix, mappingInfo),
                _ => null,
            };
        }
        return null;
    }

    /// <summary>
    /// Đảo ngược toán tử so sánh
    /// </summary>
    private ExpressionType ReverseComparisonOperator(ExpressionType nodeType)
    {
        return nodeType switch
        {
            ExpressionType.GreaterThan => ExpressionType.LessThan,
            ExpressionType.GreaterThanOrEqual => ExpressionType.LessThanOrEqual,
            ExpressionType.LessThan => ExpressionType.GreaterThan,
            ExpressionType.LessThanOrEqual => ExpressionType.GreaterThanOrEqual,
            _ => nodeType
        };
    }
}
