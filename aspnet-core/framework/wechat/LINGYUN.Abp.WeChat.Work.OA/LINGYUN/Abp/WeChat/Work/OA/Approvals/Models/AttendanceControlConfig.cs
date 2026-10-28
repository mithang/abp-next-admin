using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình thành phần chấm công nghỉ phép - thành phần công tác/ngoài văn phòng/tăng ca
/// </summary>
public class AttendanceControlConfig : ControlConfig
{
    /// <summary>
    /// Thành phần chấm công nghỉ phép - thành phần công tác/ngoài văn phòng/tăng ca
    /// </summary>
    [NotNull]
    [JsonProperty("attendance")]
    [JsonPropertyName("attendance")]
    public AttendanceConfig Attendance { get; set; } = default!;
    public AttendanceControlConfig()
    {

    }

    public AttendanceControlConfig(AttendanceConfig attendance)
    {
        Attendance = attendance;
    }
}

public class AttendanceConfig
{
    /// <summary>
    /// Loại thành phần chấm công nghỉ phép: 3-Công tác; 4-Ngoài văn phòng; 5-Tăng ca
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public byte Type { get; set; }
    /// <summary>
    /// Phạm vi chọn thời gian của thành phần chấm công nghỉ phép
    /// </summary>
    [NotNull]
    [JsonProperty("date_range")]
    [JsonPropertyName("date_range")]
    public DateRangeConfig DateRange { get; set; } = default!;
    public AttendanceConfig()
    {

    }

    public AttendanceConfig(byte type, DateRangeConfig dateRange)
    {
        Type = type;
        DateRange = dateRange;
    }
}