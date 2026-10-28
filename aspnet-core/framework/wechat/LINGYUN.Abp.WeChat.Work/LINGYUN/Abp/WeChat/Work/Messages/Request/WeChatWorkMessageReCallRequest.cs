using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Request;
/// <summary>
/// Đối tượng yêu cầu thu hồi tin nhắn
/// </summary>
public class WeChatWorkMessageReCallRequest : WeChatWorkRequest
{
    /// <summary>
    /// Chứng thực gọi giao diện
    /// </summary>
    [System.Text.Json.Serialization.JsonIgnore]
    [Newtonsoft.Json.JsonIgnore]
    public string AccessToken { get; set; }
    /// <summary>
    /// ID tin nhắn
    /// </summary>
    [JsonProperty("msgid")]
    [JsonPropertyName("msgid")]
    public string MessageId { get; set; }
    public WeChatWorkMessageReCallRequest(string accessToken, string messageId)
    {
        AccessToken = accessToken;
        MessageId = messageId;
    }
}
