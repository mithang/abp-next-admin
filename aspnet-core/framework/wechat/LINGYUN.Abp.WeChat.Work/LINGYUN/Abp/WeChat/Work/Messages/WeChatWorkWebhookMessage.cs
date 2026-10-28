using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages;
/// <summary>
/// Cấu trúc tin nhắn Webhook WeChat Work
/// </summary>
public abstract class WeChatWorkWebhookMessage : WeChatWorkRequest
{
    /// <summary>
    /// Loại tin nhắn
    /// </summary>
    [NotNull]
    [JsonProperty("msgtype")]
    [JsonPropertyName("msgtype")]
    public string MsgType { get; set; }
    protected WeChatWorkWebhookMessage(string msgType)
    {
        MsgType = Check.NotNullOrWhiteSpace(msgType, nameof(msgType));
    }
}
