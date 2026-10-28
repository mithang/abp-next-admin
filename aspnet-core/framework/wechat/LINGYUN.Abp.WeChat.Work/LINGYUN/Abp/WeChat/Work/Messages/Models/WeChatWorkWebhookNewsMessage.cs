using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn bài viết Webhook của WeChat Work
/// </summary>
public class WeChatWorkWebhookNewsMessage : WeChatWorkWebhookMessage
{
    /// <summary>
    /// Thân tin nhắn bài viết
    /// </summary>
    [NotNull]
    [JsonProperty("news")]
    [JsonPropertyName("news")]
    public WebhookNewsMessage News { get; set; }
    /// <summary>
    /// Tạo một tin nhắn bài viết Webhook của WeChat Work
    /// </summary>
    /// <param name="news">Thân tin nhắn bài viết</param>
    public WeChatWorkWebhookNewsMessage(WebhookNewsMessage news)
        : base("news")
    {
        News = news;
    }
}
