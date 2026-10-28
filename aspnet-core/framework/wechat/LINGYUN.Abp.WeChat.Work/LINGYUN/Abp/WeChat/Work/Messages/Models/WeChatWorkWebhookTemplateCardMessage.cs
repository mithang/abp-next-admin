using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn thẻ mẫu Webhook của WeChat Work
/// </summary>
public class WeChatWorkWebhookTemplateCardMessage : WeChatWorkWebhookMessage
{
    /// <summary>
    /// Thân tin nhắn thẻ mẫu
    /// </summary>
    [NotNull]
    [JsonProperty("template_card")]
    [JsonPropertyName("template_card")]
    public WebhookTemplateCardMessage TemplateCard { get; set; }
    /// <summary>
    /// Tạo một tin nhắn thẻ mẫu Webhook của WeChat Work
    /// </summary>
    /// <param name="templateCard">Thân tin nhắn thẻ mẫu</param>
    public WeChatWorkWebhookTemplateCardMessage(WebhookTemplateCardMessage templateCard)
        : base("template_card")
    {
        TemplateCard = templateCard;
    }
}
