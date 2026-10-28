using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn hình ảnh Webhook của WeChat Work
/// </summary>
public class WeChatWorkWebhookImageMessage : WeChatWorkWebhookMessage
{
    /// <summary>
    /// Thân tin nhắn hình ảnh
    /// </summary>
    [NotNull]
    [JsonProperty("image")]
    [JsonPropertyName("image")]
    public WebhookImageMessage Image { get; set; }
    /// <summary>
    /// Tạo một tin nhắn hình ảnh Webhook của WeChat Work
    /// </summary>
    /// <param name="image">Thân tin nhắn hình ảnh</param>
    public WeChatWorkWebhookImageMessage(WebhookImageMessage image)
        : base("image")
    {
        Image = image;
    }
}
