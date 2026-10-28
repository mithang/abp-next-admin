using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Response;
/// <summary>
/// Kết quả phản hồi chuyển đổi opengid nhóm khách hàng
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/94822" />
/// </remarks>
public class WeChatWorkOpengIdToChatIdResponse : WeChatWorkResponse
{
    /// <summary>
    /// ID nhóm khách hàng, có thể dùng để gọi lấy chi tiết nhóm khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("chat_id")]
    [JsonPropertyName("chat_id")]
    public string ChatId { get; set; } = default!;
}
