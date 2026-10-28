using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Kiểu ảnh
/// </summary>
public class WebhookTemplateCardImage
{
    /// <summary>
    /// url của ảnh
    /// </summary>
    [NotNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string Url { get; set; }
    /// <summary>
    /// Tỷ lệ khung hình của ảnh, tỷ lệ khung hình phải nhỏ hơn 2.25 và lớn hơn 1.3; nếu không điền tham số này thì mặc định là 1.3
    /// </summary>
    [CanBeNull]
    [JsonProperty("aspect_ratio")]
    [JsonPropertyName("aspect_ratio")]
    public float? AspectRatio { get; set; }
    /// <summary>
    /// Tạo một kiểu ảnh
    /// </summary>
    /// <param name="url">url của ảnh</param>
    /// <param name="aspectRatio">Tỷ lệ khung hình của ảnh, nếu không điền tham số này thì mặc định là 1.3</param>
    public WebhookTemplateCardImage(string url, float? aspectRatio = 1.3f)
    {
        Url = url;
        AspectRatio = aspectRatio;
    }
}
