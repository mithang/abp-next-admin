using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn ảnh Webhook
/// </summary>
public class WebhookImageMessage
{
    /// <summary>
    /// Mã hoá base64 của nội dung ảnh
    /// </summary>
    [NotNull]
    [JsonProperty("base64")]
    [JsonPropertyName("base64")]
    public string Base64 { get; set; }
    /// <summary>
    /// md5 của ảnh
    /// </summary>
    [NotNull]
    [JsonProperty("md5")]
    [JsonPropertyName("md5")]
    public string Md5 { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn ảnh Webhook
    /// </summary>
    /// <param name="base64">Mã hoá base64 của nội dung ảnh</param>
    /// <param name="md5">md5 của ảnh</param>
    public WebhookImageMessage(string base64, string md5)
    {
        Base64 = base64;
        Md5 = md5;
    }
}
