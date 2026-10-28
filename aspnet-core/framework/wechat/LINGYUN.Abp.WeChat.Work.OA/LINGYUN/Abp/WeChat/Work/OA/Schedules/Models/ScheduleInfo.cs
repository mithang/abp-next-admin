using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Chi tiết lịch trình
/// </summary>
public class ScheduleInfo
{
    /// <summary>
    /// ID lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("schedule_id")]
    [JsonPropertyName("schedule_id")]
    public string ScheduleId { get; set; } = default!;
    /// <summary>
    /// Danh sách userid của quản trị viên
    /// </summary>
    [NotNull]
    [JsonProperty("admins")]
    [JsonPropertyName("admins")]
    public string[] Admins { get; set; } = default!;
    /// <summary>
    /// Danh sách người tham gia lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("attendees")]
    [JsonPropertyName("attendees")]
    public ScheduleAttendeeInfo[] Attendees { get; set; } = default!;
    /// <summary>
    /// Tiêu đề lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("summary")]
    [JsonPropertyName("summary")]
    public string Summary { get; set; } = default!;
    /// <summary>
    /// Mô tả lịch trình
    /// </summary>
    [CanBeNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    /// <summary>
    /// Thông tin liên quan đến nhắc nhở
    /// </summary>
    [CanBeNull]
    [JsonProperty("reminders")]
    [JsonPropertyName("reminders")]
    public ScheduleReminder? Reminders { get; set; }
    /// <summary>
    /// Địa chỉ lịch trình
    /// </summary>
    /// <remarks>
    /// Không quá 128 ký tự
    /// </remarks>
    [CanBeNull]
    [JsonProperty("location")]
    [JsonPropertyName("location")]
    public string? Location { get; set; }
    /// <summary>
    /// Trạng thái lịch trình
    /// </summary>
    [NotNull]
    [JsonProperty("status")]
    [JsonPropertyName("status")]
    public ScheduleStatus Status { get; set; }
    /// <summary>
    /// Thời gian bắt đầu lịch trình, timestamp Unix
    /// </summary>
    [NotNull]
    [JsonProperty("start_time")]
    [JsonPropertyName("start_time")]
    public long StartTime { get; set; }
    /// <summary>
    /// Thời gian kết thúc lịch trình, timestamp Unix
    /// </summary>
    [NotNull]
    [JsonProperty("end_time")]
    [JsonPropertyName("end_time")]
    public long EndTime { get; set; }
    /// <summary>
    /// Có phải lịch trình cả ngày hay không
    /// </summary>
    [NotNull]
    [JsonProperty("is_whole_day")]
    [JsonPropertyName("is_whole_day")]
    [Newtonsoft.Json.JsonConverter(typeof(IntToBoolConverter))]
    [System.Text.Json.Serialization.JsonConverter(typeof(IntToBoolConverter))]
    public bool IsWholeDay { get; set; }
    /// <summary>
    /// ID lịch chứa lịch trình
    /// </summary>
    /// <remarks>
    /// Không quá 64 byte
    /// </remarks>
    [CanBeNull]
    [JsonProperty("cal_id")]
    [JsonPropertyName("cal_id")]
    public string? CalId { get; set; }
}
