using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn MarkdownV2 Webhook của WeChat Work
/// </summary>
public class WeChatWorkWebhookMarkdownV2Message : WeChatWorkWebhookMessage
{
    /// <summary>
    /// Thân tin nhắn markdown_v2
    /// </summary>
    [NotNull]
    [JsonProperty("markdown_v2")]
    [JsonPropertyName("markdown_v2")]
    public WebhookMarkdownV2Message Markdown { get; set; }
    /// <summary>
    /// Tạo một tin nhắn MarkdownV2 Webhook của WeChat Work
    /// </summary>
    /// <param name="markdown">Thân tin nhắn markdown_v2</param>
    public WeChatWorkWebhookMarkdownV2Message(WebhookMarkdownV2Message markdown)
    : base("markdown_v2")
    {
        Markdown = markdown;
    }
}
