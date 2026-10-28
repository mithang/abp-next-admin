using System.Collections.Generic;

namespace LINGYUN.Abp.Elasticsearch;

/// <summary>
/// Thông tin ánh xạ của trường Nested
/// </summary>
public class NestedMappingInfo
{
    /// <summary>
    /// Đường dẫn đầy đủ của trường Nested
    /// </summary>
    public string Path { get; set; } = string.Empty;

    /// <summary>
    /// Tên trường Nested (đoạn cuối cùng)
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Ánh xạ thuộc tính bên trong Nested
    /// </summary>
    public Dictionary<string, FieldMappingInfo> Properties { get; set; } = new();

    /// <summary>
    /// Có chứa trường con được chỉ định hay không
    /// </summary>
    public bool ContainsProperty(string propertyName)
    {
        return Properties.ContainsKey(propertyName);
    }

    /// <summary>
    /// Lấy thông tin trường con
    /// </summary>
    public FieldMappingInfo? GetProperty(string propertyName)
    {
        return Properties.GetOrDefault(propertyName);
    }

    /// <summary>
    /// Lấy đường dẫn đầy đủ của trường bên trong nested
    /// </summary>
    public string GetFullPath(string propertyName)
    {
        return $"{Path}.{propertyName}";
    }

    /// <summary>
    /// Lấy thông tin ánh xạ của trường bên trong nested (đệ quy)
    /// </summary>
    public FieldMappingInfo? GetNestedField(string fullPath)
    {
        // Loại bỏ tiền tố đường dẫn nested hiện tại
        if (!fullPath.StartsWith(Path + "."))
        {
            return null;
        }

        var remainingPath = fullPath.Substring(Path.Length + 1);
        var parts = remainingPath.Split('.');

        FieldMappingInfo? current = null;
        Dictionary<string, FieldMappingInfo>? currentProperties = Properties;

        for (var i = 0; i < parts.Length; i++)
        {
            var part = parts[i];

            if (currentProperties == null)
            {
                return null;
            }

            if (!currentProperties.TryGetValue(part, out current))
            {
                return null;
            }

            // Nếu còn cấp tiếp theo và trường hiện tại là kiểu object hoặc nested
            if (i < parts.Length - 1)
            {
                currentProperties = current.Properties;
            }
        }

        return current;
    }
}
