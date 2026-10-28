using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Request;
/// <summary>
/// Tham số yêu cầu hủy đặt phòng họp
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/93620#%E5%8F%96%E6%B6%88%E9%A2%84%E5%AE%9A%E4%BC%9A%E8%AE%AE%E5%AE%A4"/>
/// </remarks>
public class WeChatWorkCancelBookMeetingRoomRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id đặt phòng của phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("booking_id")]
    [JsonPropertyName("booking_id")]
    public string BookingId { get; }
    /// <summary>
    /// Có giữ lại lịch trình hay không, 0 - xóa đồng bộ, 1 - giữ lại, chỉ có hiệu lực với lịch trình không lặp lại
    /// </summary>
    [NotNull]
    [JsonProperty("keep_schedule")]
    [JsonPropertyName("keep_schedule")]
    public int KeepSchedule { get; }
    /// <summary>
    /// Đối với lịch trình lặp lại, nếu không điền tham số này nghĩa là hủy tất cả các lần đặt lặp lại; nếu điền, nghĩa là hủy lần đặt phòng họp của ngày tương ứng
    /// </summary>
    [CanBeNull]
    [JsonProperty("cancel_date")]
    [JsonPropertyName("cancel_date")]
    public long? CancelDate { get; private set; }
    public WeChatWorkCancelBookMeetingRoomRequest(
        string bookingId,
        bool keepSchedule = false, 
        DateTime? cancelDate = null)
    {
        BookingId = Check.NotNullOrWhiteSpace(bookingId, nameof(bookingId));
        KeepSchedule = keepSchedule ? 1 : 0;
        if (cancelDate.HasValue)
        {
            CancelDate = (long)(cancelDate.Value - new DateTime(1970, 1, 1)).TotalSeconds;
        }
    }
}
