using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển khoảng thời gian
/// </summary>
public class DateRangeControlValue : ControlValue
{
    /// <summary>
    /// Khoảng thời gian
    /// </summary>
    [NotNull]
    [JsonProperty("date_range")]
    [JsonPropertyName("date_range")]
    public DateRangeValue DateRange { get; set; } = default!;
    public DateRangeControlValue()
    {

    }

    public DateRangeControlValue(DateRangeValue dateRange)
    {
        DateRange = dateRange;
    }
}

public class DateRangeValue
{
    /// <summary>
    /// Độ chi tiết của khoảng thời gian: halfday: theo ngày, hour: theo giờ
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
    /// <summary>
    /// Thời gian bắt đầu, dấu thời gian Unix. Khi type là halfday, giá trị chỉ có thể là hai thời điểm cố định: buổi sáng: dấu thời gian 00:00:00 trong ngày, buổi chiều: dấu thời gian 12:00:00 trong ngày
    /// </summary>
    [NotNull]
    [JsonProperty("new_begin")]
    [JsonPropertyName("new_begin")]
    public long NewBegin { get; set; } = default!;
    /// <summary>
    /// Thời gian kết thúc, dấu thời gian Unix. Khi type là halfday, giá trị chỉ có thể là hai thời điểm cố định: buổi sáng: dấu thời gian 00:00:00 trong ngày, buổi chiều: dấu thời gian 12:00:00 trong ngày
    /// </summary>
    [NotNull]
    [JsonProperty("new_end")]
    [JsonPropertyName("new_end")]
    public long NewEnd { get; set; }
    /// <summary>
    /// Phạm vi khoảng thời gian, đơn vị giây
    /// </summary>
    [NotNull]
    [JsonProperty("new_duration")]
    [JsonPropertyName("new_duration")]
    public long NewDuration { get; set; }
    public DateRangeValue()
    {

    }

    public DateRangeValue(string type, long newBegin, long newEnd, long newDuration)
    {
        Type = type;
        NewBegin = newBegin;
        NewEnd = newEnd;
        NewDuration = newDuration;
    }
}
