using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Request;
/// <summary>
/// Tham số yêu cầu đặt phòng họp thông qua lịch trình
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/93620#%E9%80%9A%E8%BF%87%E6%97%A5%E7%A8%8B%E9%A2%84%E5%AE%9A%E4%BC%9A%E8%AE%AE%E5%AE%A4"/>
/// </remarks>
public class WeChatWorkBookMeetingRoomByScheduleRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("meetingroom_id")]
    [JsonPropertyName("meetingroom_id")]
    public int MeetingRoomId { get; }
    /// <summary>
    /// Userid của người đặt
    /// </summary>
    [NotNull]
    [JsonProperty("booker")]
    [JsonPropertyName("booker")]
    public string Booker { get; }
    /// <summary>
    /// Id lịch trình liên kết với cuộc họp
    /// </summary>
    [NotNull]
    [JsonProperty("schedule_id")]
    [JsonPropertyName("schedule_id")]
    public string ScheduleId { get; }
    public WeChatWorkBookMeetingRoomByScheduleRequest(
        int meetingRoomId, 
        string booker, 
        string scheduleId)
    {
        MeetingRoomId = Check.NotDefaultOrNull<int>(meetingRoomId, nameof(meetingRoomId));
        Booker = Check.NotNullOrWhiteSpace(booker, nameof(booker));
        ScheduleId = Check.NotNullOrWhiteSpace(scheduleId, nameof(scheduleId));
    }
}
