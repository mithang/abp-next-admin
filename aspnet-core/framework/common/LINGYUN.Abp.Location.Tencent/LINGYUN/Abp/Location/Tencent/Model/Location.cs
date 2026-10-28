using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Model;

/// <summary>
/// Tọa độ điểm trung tâm của đơn vị hành chính
/// </summary>
public class Location
{
    /// <summary>
    /// Vĩ độ
    /// </summary>
    [JsonProperty("lat")]
    public double Lat { get; set; }
    /// <summary>
    /// Kinh độ
    /// </summary>
    [JsonProperty("lng")]
    public double Lng { get; set; }
}
