using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình thành phần khoảng thời gian
/// </summary>
public class DateRangeControlConfig : ControlConfig
{
    /// <summary>
    /// Thành phần khoảng thời gian
    /// </summary>
    [NotNull]
    [JsonProperty("date_range")]
    [JsonPropertyName("date_range")]
    public DateRangeConfig DateRange { get; set; } = default!;
    public DateRangeControlConfig()
    {

    }

    public DateRangeControlConfig(DateRangeConfig dateRange)
    {
        DateRange = dateRange;
    }
}
