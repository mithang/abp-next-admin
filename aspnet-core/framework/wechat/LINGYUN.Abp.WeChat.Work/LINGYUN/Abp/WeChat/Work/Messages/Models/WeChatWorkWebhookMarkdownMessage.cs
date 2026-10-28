using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn Markdown Webhook của WeChat Work
/// </summary>
public class WeChatWorkWebhookMarkdownMessage : WeChatWorkWebhookMessage
{
    /// <summary>
    /// Thân tin nhắn Markdown
    /// </summary>
    [NotNull]
    [JsonProperty("markdown")]
    [JsonPropertyName("markdown")]
    public WebhookMarkdownMessage Markdown { get; set; }
    /// <summary>
    /// Tạo một tin nhắn Markdown Webhook của WeChat Work
    /// </summary>
    /// <param name="markdown">Thân tin nhắn Markdown</param>
    public WeChatWorkWebhookMarkdownMessage(WebhookMarkdownMessage markdown)
    : base("markdown")
    {
        Markdown = markdown;
    }
}
