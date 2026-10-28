using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn tệp Webhook của WeChat Work
/// </summary>
public class WeChatWorkWebhookFileMessage : WeChatWorkWebhookMessage
{
    /// <summary>
    /// Thân tin nhắn tệp
    /// </summary>
    [NotNull]
    [JsonProperty("file")]
    [JsonPropertyName("file")]
    public WebhookFileMessage File { get; set; }
    /// <summary>
    /// Tạo một tin nhắn tệp Webhook của WeChat Work
    /// </summary>
    /// <param name="file">Thân tin nhắn tệp</param>
    public WeChatWorkWebhookFileMessage(WebhookFileMessage file)
        : base("file")
    {
        File = file;
    }
}
