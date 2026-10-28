using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Request;
/// <summary>
/// Tham số yêu cầu truy vấn thông tin đặt phòng họp
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/93620#%E6%9F%A5%E8%AF%A2%E4%BC%9A%E8%AE%AE%E5%AE%A4%E7%9A%84%E9%A2%84%E5%AE%9A%E4%BF%A1%E6%81%AF"/>
/// </remarks>
public class WeChatWorkGetMeetingRoomBookingListRequest : WeChatWorkRequest
{
    private readonly static DateTime _beginUnixTime = new DateTime(1970, 1, 1);
    /// <summary>
    /// ID phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("meetingroom_id")]
    [JsonPropertyName("meetingroom_id")]
    public int? MeetingRoomId { get; set; }
    /// <summary>
    /// Thành phố nơi đặt phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("city")]
    [JsonPropertyName("city")]
    public string? City { get; set; }
    /// <summary>
    /// Tòa nhà nơi đặt phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("building")]
    [JsonPropertyName("building")]
    public string? Building { get; set; }
    /// <summary>
    /// Tầng nơi đặt phòng họp
    /// </summary>
    [CanBeNull]
    [JsonProperty("floor")]
    [JsonPropertyName("floor")]
    public string? Floor { get; set; }
    /// <summary>
    /// Thời gian bắt đầu truy vấn đặt phòng, nếu để trống mặc định là thời gian hiện tại
    /// </summary>
    [CanBeNull]
    [JsonProperty("start_time")]
    [JsonPropertyName("start_time")]
    public long? StartTime { get; private set; }
    /// <summary>
    /// Thời gian kết thúc truy vấn đặt phòng, nếu để trống mặc định là 0 giờ ngày mai
    /// </summary>
    [CanBeNull]
    [JsonProperty("end_time")]
    [JsonPropertyName("end_time")]
    public long? EndTime { get; private set; }
    /// <summary>
    /// Đặt phạm vi thời gian truy vấn đặt phòng
    /// </summary>
    /// <param name="startTime">Thời gian bắt đầu</param>
    /// <param name="endTime">Thời gian kết thúc</param>
    public void Beetween(DateTime startTime, DateTime endTime)
    {
        StartTime = (long)(startTime - _beginUnixTime).TotalSeconds;
        EndTime = (long)(endTime - _beginUnixTime).TotalSeconds;
    }
}
