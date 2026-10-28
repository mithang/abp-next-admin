using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn giọng nói Webhook của WeChat Work
/// </summary>
public class WeChatWorkWebhookVoiceMessage : WeChatWorkWebhookMessage
{
    /// <summary>
    /// Thân tin nhắn giọng nói
    /// </summary>
    [NotNull]
    [JsonProperty("voice")]
    [JsonPropertyName("voice")]
    public WebhookVoiceMessage Voice { get; set; }
    /// <summary>
    /// Tạo một tin nhắn giọng nói Webhook của WeChat Work
    /// </summary>
    /// <param name="voice">Thân tin nhắn giọng nói</param>
    public WeChatWorkWebhookVoiceMessage(WebhookVoiceMessage voice)
        : base("voice")
    {
        Voice = voice;
    }
}
