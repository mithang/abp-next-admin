using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình điều khiển vị trí
/// </summary>
public class LocationControlConfig : ControlConfig
{
    /// <summary>
    /// Điều khiển vị trí
    /// </summary>
    [NotNull]
    [JsonProperty("location")]
    [JsonPropertyName("location")]
    public LocationConfig Location { get; set; } = default!;
    public LocationControlConfig()
    {

    }

    public LocationControlConfig(LocationConfig location)
    {
        Location = location;
    }
}

public class LocationConfig
{
    /// <summary>
    /// Khoảng cách, hiện hỗ trợ 100, 200, 300
    /// </summary>
    [NotNull]
    [JsonProperty("distance")]
    [JsonPropertyName("distance")]
    public int Distance { get; set; }
    public LocationConfig()
    {

    }

    public LocationConfig(int distance)
    {
        Distance = distance;
    }
}
