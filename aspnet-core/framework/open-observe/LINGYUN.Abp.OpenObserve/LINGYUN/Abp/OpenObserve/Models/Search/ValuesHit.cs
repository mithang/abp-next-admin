using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Search;

/// <summary>
/// Giá trị của một trường đơn
/// </summary>
public class ValuesHit
{
    /// <summary>
    /// Tên trường
    /// </summary>
    [JsonPropertyName("field")]
    public string? Field { get; set; }

    /// <summary>
    /// Danh sách giá trị
    /// </summary>
    [JsonPropertyName("values")]
    public ValuesItem[] Values { get; set; } = [];
}
