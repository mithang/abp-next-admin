using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Mô tả vị trí
/// </summary>
public class FormattedAddress
{
    /// <summary>
    /// Cách mô tả đã được tối ưu bởi Tencent Maps, mang tính nhân văn hơn
    /// </summary>
    [JsonProperty("recommend")]
    public string? ReCommend { get; set; }
    /// <summary>
    /// Vị trí đại khái, có thể dùng để mô tả vị trí một cách sơ lược
    /// </summary>
    [JsonProperty("rough")]
    public string? Rough { get; set; }
}
