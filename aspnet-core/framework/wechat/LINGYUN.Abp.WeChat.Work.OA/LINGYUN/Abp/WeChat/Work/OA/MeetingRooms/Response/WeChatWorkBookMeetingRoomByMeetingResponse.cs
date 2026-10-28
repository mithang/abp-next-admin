using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Response;
/// <summary>
/// Tham số phản hồi đặt phòng họp qua cuộc họp
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/93620#%E9%80%9A%E8%BF%87%E4%BC%9A%E8%AE%AE%E9%A2%84%E5%AE%9A%E4%BC%9A%E8%AE%AE%E5%AE%A4"/>
/// </remarks>
public class WeChatWorkBookMeetingRoomByMeetingResponse : WeChatWorkResponse
{
    /// <summary>
    /// Id đặt phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("booking_id")]
    [JsonPropertyName("booking_id")]
    public string BookingId { get; set; } = default!;
    /// <summary>
    /// Danh sách ngày xung đột của phòng họp, là dấu thời gian lúc 0 giờ trong ngày; khi dùng lịch trình lặp lại để đặt phòng họp, trả về khi một số ngày xung đột với tình trạng đặt phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("conflict_date")]
    [JsonPropertyName("conflict_date")]
    public long[] ConflictDate { get; set; } = default!;
}
