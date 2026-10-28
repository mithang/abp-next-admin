using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Request;
/// <summary>
/// Tham số yêu cầu chuyển đổi opengid của nhóm khách hàng
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/94822" />
/// </remarks>
public class WeChatWorkOpengIdToChatIdRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id nhóm mà mini-program lấy được trong WeChat
    /// </summary>
    [NotNull]
    [JsonProperty("opengid")]
    [JsonPropertyName("opengid")]
    public string OpengId { get; }
    public WeChatWorkOpengIdToChatIdRequest(string opengId)
    {
        Check.NotNullOrWhiteSpace(opengId, nameof(opengId));

        OpengId = opengId;
    }
}
