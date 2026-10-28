using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.Elasticsearch;

public partial class ExpressionQueryTranslator
{
    /// <summary>
    /// Phân tích trường
    /// </summary>
    protected virtual FieldInfo ResolveField(Expression expression, string? prefix, IndexMappingInfo? mappingInfo)
    {
        var current = expression;
        while (current is UnaryExpression { NodeType: ExpressionType.Convert or ExpressionType.ConvertChecked } unary)
        {
            current = unary.Operand;
        }

        var names = new Stack<string>();
        Type? leafType = null;
        string? leafName = null;

        // Thu thập đường dẫn thành viên
        while (current is MemberExpression member)
        {
            leafName ??= member.Member.Name;
            leafType ??= GetMemberType(member.Member);
            names.Push(ResolveFieldName(member.Member));
            current = member.Expression!;
        }

        if (current is not ParameterExpression && current is not ConstantExpression)
        {
            throw new NotSupportedException($"Unable to parse as field path: {expression}");
        }

        var path = string.Join(".", names);

        // Áp dụng tiền tố
        if (!string.IsNullOrEmpty(prefix) && path.Length > 0)
        {
            path = prefix + "." + path;
        }
        else if (path.Length == 0)
        {
            path = prefix ?? string.Empty;
        }

        // Lấy thông tin ánh xạ trường
        var finalMapping = mappingInfo?.GetField(path);

        // Nếu là kiểu text và có trường con keyword, tự động dùng .keyword
        if (finalMapping?.IsText == true && finalMapping.Properties?.ContainsKey("keyword") == true)
        {
            path = $"{path}.keyword";
            finalMapping = mappingInfo?.GetField(path);
        }

        // Nếu leafType bằng null, dùng expression.Type
        var type = leafType ?? expression.Type;
        var underlyingType = Nullable.GetUnderlyingType(type) ?? type;

        return new FieldInfo(
            path,
            underlyingType,
            leafName ?? string.Empty,
            finalMapping?.IsKeyword ?? false,
            finalMapping?.IsText ?? false,
            finalMapping?.IsWildcard ?? false,
            finalMapping?.IsNested ?? false || (mappingInfo?.IsNested(path) ?? false),
            finalMapping?.IsDate ?? false,
            finalMapping?.IsNumeric ?? false,
            finalMapping?.IsBoolean ?? false,
            finalMapping?.IsRange ?? false,
            finalMapping?.Format,
            finalMapping?.HasMultiFields ?? false
        );
    }

    /// <summary>
    /// Lấy kiểu thực tế của thành viên
    /// </summary>
    private static Type GetMemberType(MemberInfo member)
    {
        return member switch
        {
            System.Reflection.FieldInfo field => field.FieldType,
            PropertyInfo property => property.PropertyType,
            MethodInfo method => method.ReturnType,
            _ => typeof(object)
        };
    }

    /// <summary>
    /// Phân tích tên trường
    /// </summary>
    private static string ResolveFieldName(MemberInfo member)
    {
        // Kiểm tra thuộc tính JsonPropertyName
        if (member is PropertyInfo property)
        {
            var jsonName = property.GetCustomAttribute<JsonPropertyNameAttribute>();
            if (jsonName != null && !string.IsNullOrWhiteSpace(jsonName.Name))
            {
                return jsonName.Name;
            }
        }

        return member.Name;
    }
}
