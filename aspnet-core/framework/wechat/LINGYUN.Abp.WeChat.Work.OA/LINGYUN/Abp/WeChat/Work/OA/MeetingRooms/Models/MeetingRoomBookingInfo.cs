using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Models;
/// <summary>
/// Thông tin đặt phòng họp
/// </summary>
public class MeetingRoomBookingInfo
{
    /// <summary>
    /// Id phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("meetingroom_id")]
    [JsonPropertyName("meetingroom_id")]
    public int MeetingRoomId { get; set; }
    /// <summary>
    /// Tình hình đặt phòng trong khoảng thời gian truy vấn của phòng họp này
    /// </summary>
    [NotNull]
    [JsonProperty("schedule")]
    [JsonPropertyName("schedule")]
    public MeetingRoomSchedule[] Schedule { get; set; } = default!;
}
