using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình thời lượng
/// </summary>
public class DateRangeConfig
{
    /// <summary>
    /// Loại hiển thị thời gian: halfday-Ngày; hour-Ngày + giờ
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
    /// <summary>
    /// 0-Ngày tự nhiên; 1-Ngày làm việc
    /// </summary>
    [NotNull]
    [JsonProperty("official_holiday")]
    [JsonPropertyName("official_holiday")]
    public byte OfficialHoliday { get; set; }
    /// <summary>
    /// Thời lượng một ngày (đơn vị là giây), phải lớn hơn 0 và nhỏ hơn hoặc bằng 86400
    /// </summary>
    [NotNull]
    [JsonProperty("perday_duration")]
    [JsonPropertyName("perday_duration")]
    public int PerdayDuration { get; set; }
    public DateRangeConfig()
    {

    }

    public DateRangeConfig(string type, byte officialHoliday, int perdayDuration)
    {
        Type = type;
        OfficialHoliday = officialHoliday;
        PerdayDuration = perdayDuration;
    }
}
