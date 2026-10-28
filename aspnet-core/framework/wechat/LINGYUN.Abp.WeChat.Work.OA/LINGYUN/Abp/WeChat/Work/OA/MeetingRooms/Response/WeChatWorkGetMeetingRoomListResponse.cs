using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Response;
/// <summary>
/// Tham số phản hồi truy vấn phòng họp
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/93619#%E6%9F%A5%E8%AF%A2%E4%BC%9A%E8%AE%AE%E5%AE%A4"/>
/// </remarks>
public class WeChatWorkGetMeetingRoomListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("meetingroom_list")]
    [JsonPropertyName("meetingroom_list")]
    public MeetingRoomInfo[] MeetingRoomList { get; set; } = default!;
}
