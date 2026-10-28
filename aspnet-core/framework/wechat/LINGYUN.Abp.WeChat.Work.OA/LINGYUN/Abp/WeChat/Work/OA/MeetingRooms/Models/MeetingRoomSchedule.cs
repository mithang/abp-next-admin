using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Models;
/// <summary>
/// Tình hình đặt phòng họp
/// </summary>
public class MeetingRoomSchedule
{
    /// <summary>
    /// Dấu thời gian bắt đầu
    /// </summary>
    [NotNull]
    [JsonProperty("start_time")]
    [JsonPropertyName("start_time")]
    public long StartTime { get; set; }
    /// <summary>
    /// Dấu thời gian kết thúc
    /// </summary>
    [NotNull]
    [JsonProperty("end_time")]
    [JsonPropertyName("end_time")]
    public long EndTime { get; set; }
    /// <summary>
    /// userid của người đặt
    /// </summary>
    [NotNull]
    [JsonProperty("booker")]
    [JsonPropertyName("booker")]
    public string Booker { get; set; } = default!;
    /// <summary>
    /// Trạng thái đặt phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("status")]
    [JsonPropertyName("status")]
    public MeetingRoomScheduleStatus Status { get; set; }
    /// <summary>
    /// id đặt phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("booking_id")]
    [JsonPropertyName("booking_id")]
    public string BookingId { get; set; } = default!;
    /// <summary>
    /// id lịch trình liên quan đến cuộc họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("schedule_id")]
    [JsonPropertyName("schedule_id")]
    public string? ScheduleId { get; set; }
}
