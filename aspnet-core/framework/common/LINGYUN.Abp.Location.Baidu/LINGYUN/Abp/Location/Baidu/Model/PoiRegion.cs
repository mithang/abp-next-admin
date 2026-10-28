using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.Location.Baidu.Model;

/// <summary>
/// Khu vực
/// </summary>
public class PoiRegion
{
    /// <summary>
    /// Tên khu vực trực thuộc
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Loại khu vực trực thuộc
    /// </summary>
    public string? Tag { get; set; }
    /// <summary>
    /// Quan hệ vị trí tương đối giữa tọa độ trong yêu cầu và khu vực trực thuộc
    /// </summary>
    [JsonProperty("direction_desc")]
    [JsonPropertyName("direction_desc")]
    public string? DirectionDesc { get; set; }
    /// <summary>
    /// Mã định danh duy nhất của POI
    /// </summary>
    public string Uid { get; set; } = default!;
    /// <summary>
    /// Khoảng cách tới điểm tọa độ
    /// </summary>
    public string? Distance { get; set; }
}
