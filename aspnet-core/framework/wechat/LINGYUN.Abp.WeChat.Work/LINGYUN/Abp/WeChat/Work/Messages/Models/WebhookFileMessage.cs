using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn tệp Webhook
/// </summary>
public class WebhookFileMessage
{
    /// <summary>
    /// Id tệp, thu được qua API tải lên tệp dưới đây
    /// </summary>
    [NotNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public string MediaId { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn tệp Webhook
    /// </summary>
    /// <param name="mediaId">Id tệp, thu được qua API tải lên tệp dưới đây</param>
    public WebhookFileMessage(string mediaId)
    {
        MediaId = mediaId;
    }
}
