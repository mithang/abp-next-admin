using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị component chấm công - công tác/xin ra ngoài/làm thêm giờ
/// </summary>
public class AttendanceControlValue : ControlValue
{
    /// <summary>
    /// Thời lượng
    /// </summary>
    [NotNull]
    [JsonProperty("attendance")]
    [JsonPropertyName("attendance")]
    public AttendanceValue Attendance { get; set; } = default!;
    public AttendanceControlValue()
    {

    }

    public AttendanceControlValue(AttendanceValue attendance)
    {
        Attendance = attendance;
    }
}

public class AttendanceValue
{
    /// <summary>
    /// Phạm vi chọn thời gian của component chấm công
    /// </summary>
    [NotNull]
    [JsonProperty("date_range")]
    [JsonPropertyName("date_range")]
    public DateRangeValue DateRange { get; set; } = default!;
    /// <summary>
    /// Loại component chấm công: 1-Nghỉ phép; 3-Công tác; 4-Ra ngoài; 5-Làm thêm giờ
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public byte Type { get; set; }
    /// <summary>
    /// Không bắt buộc. Thông tin phân đoạn thời lượng
    /// </summary>
    [CanBeNull]
    [JsonProperty("slice_info")]
    [JsonPropertyName("slice_info")]
    public AttendanceSliceInfo? SliceInfo { get; set; }
}

public class AttendanceSliceInfo
{
    /// <summary>
    /// Loại component chấm công: 1-Nghỉ phép; 3-Công tác; 4-Ra ngoài; 5-Làm thêm giờ
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public byte Type { get; set; }
    /// <summary>
    /// Phân đoạn của một ngày
    /// </summary>
    [NotNull]
    [JsonProperty("day_items")]
    [JsonPropertyName("day_items")]
    public List<AttendanceSliceDayItem> DayItems { get; set; } = default!;
    public AttendanceSliceInfo()
    {

    }

    public AttendanceSliceInfo(byte type, List<AttendanceSliceDayItem> dayItems)
    {
        Type = type;
        DayItems = dayItems;
    }
}

public class AttendanceSliceDayItem
{
    /// <summary>
    /// Timestamp lúc 0 giờ của ngày đó (timestamp lúc 0 giờ theo múi giờ UTC+8 của ngày đó)
    /// </summary>
    [NotNull]
    [JsonProperty("daytime")]
    [JsonPropertyName("daytime")]
    public long Daytime { get; set; }
    /// <summary>
    /// Thời lượng của một ngày, tính bằng giây, có thể bằng 0 (khi type là halfday: làm thêm giờ: phải là bội số nguyên của 8640, các trường hợp khác: phải là bội số nguyên của 43200, khi type là hour phải là bội số nguyên của 360)
    /// </summary>
    [NotNull]
    [JsonProperty("duration")]
    [JsonPropertyName("duration")]
    public long Duration { get; set; }
    public AttendanceSliceDayItem()
    {

    }

    public AttendanceSliceDayItem(long daytime, long duration)
    {
        Daytime = daytime;
        Duration = duration;
    }
}