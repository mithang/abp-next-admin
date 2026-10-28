using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Request;
/// <summary>
/// Tham số yêu cầu lấy tình trạng đồng ý phiên trò chuyện nhóm
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91782" />
/// </remarks>
public class WeChatWorkCheckRoomAgreeRequest : WeChatWorkRequest
{
    /// <summary>
    /// roomid cần truy vấn
    /// </summary>
    [NotNull]
    [JsonProperty("roomid")]
    [JsonPropertyName("roomid")]
    public string RoomId { get; }
    public WeChatWorkCheckRoomAgreeRequest(string roomId)
    {
        RoomId = roomId;
    }
}
