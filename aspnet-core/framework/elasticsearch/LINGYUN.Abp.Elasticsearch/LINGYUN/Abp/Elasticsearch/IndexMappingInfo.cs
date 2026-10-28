using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace LINGYUN.Abp.Elasticsearch;
/// <summary>
/// Thông tin ánh xạ chỉ mục
/// </summary>
public class IndexMappingInfo
{
    /// <summary>
    /// Tên chỉ mục
    /// </summary>
    public string IndexName { get; set; } = string.Empty;

    /// <summary>
    /// Loại tài liệu
    /// </summary>
    public Type? DocumentType { get; set; }

    /// <summary>
    /// Tất cả ánh xạ trường (dạng phẳng)
    /// </summary>
    public Dictionary<string, FieldMappingInfo> Fields { get; set; } = new Dictionary<string, FieldMappingInfo>(StringComparer.CurrentCultureIgnoreCase);

    /// <summary>
    /// Ánh xạ trường được lập chỉ mục theo đường dẫn thuộc tính CLR
    /// </summary>
    public Dictionary<string, FieldMappingInfo> ClrFields { get; set; } = new Dictionary<string, FieldMappingInfo>(StringComparer.CurrentCultureIgnoreCase);

    /// <summary>
    /// Ánh xạ trường Nested
    /// </summary>
    public Dictionary<string, NestedMappingInfo> NestedFields { get; set; } = new Dictionary<string, NestedMappingInfo>(StringComparer.CurrentCultureIgnoreCase);

    /// <summary>
    /// Danh sách trường Keyword
    /// </summary>
    public HashSet<string> KeywordFields { get; set; } = new();

    /// <summary>
    /// Danh sách trường Text
    /// </summary>
    public HashSet<string> TextFields { get; set; } = new();
    /// <summary>
    /// Danh sách trường Wildcard
    /// </summary>
    public HashSet<string> WildcardFields { get; set; } = new();

    /// <summary>
    /// Danh sách trường ngày tháng
    /// </summary>
    public HashSet<string> DateFields { get; set; } = new();

    /// <summary>
    /// Danh sách trường số
    /// </summary>
    public HashSet<string> NumericFields { get; set; } = new();

    /// <summary>
    /// Danh sách trường Boolean
    /// </summary>
    public HashSet<string> BooleanFields { get; set; } = new();

    /// <summary>
    /// Danh sách đường dẫn trường Nested
    /// </summary>
    public HashSet<string> NestedFieldPaths { get; set; } = new();

    /// <summary>
    /// Lấy thông tin ánh xạ trường
    /// </summary>
    public FieldMappingInfo? GetField(string path)
    {
        return Fields.GetOrDefault(path);
    }

    /// <summary>
    /// Lấy thông tin ánh xạ trường theo đường dẫn thuộc tính CLR
    /// </summary>
    public FieldMappingInfo? GetFieldByClrPath(string clrPath)
    {
        return ClrFields.GetOrDefault(clrPath);
    }

    /// <summary>
    /// Lấy thông tin ánh xạ trường theo biểu thức thuộc tính CLR
    /// </summary>
    public FieldMappingInfo? GetFieldByExpression<TDocument>(Expression<Func<TDocument, object?>> expression)
    {
        var clrPath = GetPropertyPath(expression);
        return GetFieldByClrPath(clrPath);
    }

    /// <summary>
    /// Lấy đường dẫn trường ES theo biểu thức thuộc tính CLR
    /// </summary>
    public string? GetElasticsearchFieldPath<TDocument>(Expression<Func<TDocument, object?>> expression)
    {
        var clrPath = GetPropertyPath(expression);
        var field = GetFieldByClrPath(clrPath);
        return field?.Path;
    }

    /// <summary>
    /// Kiểm tra có phải trường Nested hay không
    /// </summary>
    public bool IsNested(string path)
    {
        return NestedFields.ContainsKey(path) || NestedFieldPaths.Contains(path);
    }

    /// <summary>
    /// Lấy thông tin trường Nested
    /// </summary>
    public NestedMappingInfo? GetNestedField(string path)
    {
        return NestedFields.GetOrDefault(path);
    }

    /// <summary>
    /// Lấy đường dẫn khớp chính xác của trường (xử lý trường con keyword của text)
    /// </summary>
    public string GetExactFieldPath(string path)
    {
        var field = GetField(path);
        if (field == null)
        {
            return path;
        }

        return field.GetKeywordPath();
    }

    /// <summary>
    /// Kiểm tra trường có cần truy vấn Nested hay không
    /// </summary>
    public bool ShouldUseNestedQuery(string path)
    {
        // Kiểm tra bản thân đường dẫn có phải Nested hay không
        if (IsNested(path))
        {
            return true;
        }

        // Kiểm tra cấp cha của đường dẫn có phải Nested hay không
        var parts = path.Split('.');
        for (var i = 0; i < parts.Length - 1; i++)
        {
            var parentPath = string.Join(".", parts.Take(i + 1));
            if (IsNested(parentPath))
            {
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// Lấy đường dẫn trường Nested (nếu trường nằm trong Nested thì trả về đường dẫn Nested cha gần nhất)
    /// </summary>
    public string? GetNestedParentPath(string path)
    {
        var parts = path.Split('.');
        for (var i = parts.Length - 1; i >= 0; i--)
        {
            var parentPath = string.Join(".", parts.Take(i + 1));
            if (IsNested(parentPath))
            {
                return parentPath;
            }
        }

        return null;
    }
    /// <summary>
    /// Chuyển đổi đường dẫn thuộc tính CLR thành đường dẫn trường ES
    /// </summary>
    public string? ConvertClrPathToElasticsearchPath(string clrPath)
    {
        var field = GetFieldByClrPath(clrPath);
        return field?.Path;
    }

    /// <summary>
    /// Chuyển đổi đường dẫn trường ES thành đường dẫn thuộc tính CLR
    /// </summary>
    public string? ConvertElasticsearchPathToClrPath(string esPath)
    {
        var field = GetField(esPath);
        return field?.ClrPath;
    }

    private static string GetPropertyPath<TDocument>(Expression<Func<TDocument, object?>> expression)
    {
        var parts = new List<string>();
        var currentExpression = expression.Body;

        while (currentExpression is MemberExpression memberExpression)
        {
            parts.Insert(0, memberExpression.Member.Name);
            currentExpression = memberExpression.Expression!;
        }

        // Xử lý biểu thức chuyển đổi
        if (currentExpression is UnaryExpression unaryExpression &&
            unaryExpression.NodeType == ExpressionType.Convert &&
            unaryExpression.Operand is MemberExpression convertMemberExpression)
        {
            parts.Insert(0, convertMemberExpression.Member.Name);
        }

        return string.Join(".", parts);
    }
}