using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Request;
/// <summary>
/// Tham số yêu cầu lấy thông tin nhóm nội bộ của kho lưu trữ nội dung phiên
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92951" />
/// </remarks>
public class WeChatWorkGetGroupChatRequest : WeChatWorkRequest
{
    /// <summary>
    /// Roomid cần truy vấn
    /// </summary>
    [NotNull]
    [JsonProperty("roomid")]
    [JsonPropertyName("roomid")]
    public string RoomId { get; }
    public WeChatWorkGetGroupChatRequest(string roomId)
    {
        RoomId = roomId;
    }
}
