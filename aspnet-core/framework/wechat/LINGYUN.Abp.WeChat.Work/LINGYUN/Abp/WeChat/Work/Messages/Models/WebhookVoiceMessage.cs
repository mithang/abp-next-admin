using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn giọng nói Webhook
/// </summary>
public class WebhookVoiceMessage
{
    /// <summary>
    /// Id tệp giọng nói, thu được qua API tải lên tệp dưới đây
    /// </summary>
    [NotNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public string MediaId { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn giọng nói Webhook
    /// </summary>
    /// <param name="mediaId">Id tệp giọng nói</param>
    public WebhookVoiceMessage(string mediaId)
    {
        MediaId = mediaId;
    }
}
