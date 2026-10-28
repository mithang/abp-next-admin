using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn văn bản Webhook của WeChat Work
/// </summary>
public class WeChatWorkWebhookTextMessage : WeChatWorkWebhookMessage
{
    /// <summary>
    /// Thân tin nhắn văn bản
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public WebhookTextMessage Text { get; set; }
    /// <summary>
    /// Tạo một tin nhắn văn bản Webhook của WeChat Work
    /// </summary>
    /// <param name="text">Thân tin nhắn văn bản</param>
    public WeChatWorkWebhookTextMessage(WebhookTextMessage text) 
        : base("text")
    {
        Text = text;
    }
}
