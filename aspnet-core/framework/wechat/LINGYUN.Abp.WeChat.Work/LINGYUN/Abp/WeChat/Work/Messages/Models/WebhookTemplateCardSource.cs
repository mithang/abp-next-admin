using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thông tin kiểu nguồn của thẻ
/// </summary>
public class WebhookTemplateCardSource
{
    /// <summary>
    /// URL hình ảnh nguồn
    /// </summary>
    [CanBeNull]
    [JsonProperty("icon_url")]
    [JsonPropertyName("icon_url")]
    public string? IconUrl { get; set; }
    /// <summary>
    /// Mô tả hình ảnh nguồn, khuyến nghị không vượt quá 13 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string? Description { get; set; }
    /// <summary>
    /// Màu của văn bản nguồn, hiện hỗ trợ: 0 (mặc định) xám, 1 đen, 2 đỏ, 3 xanh lá
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc_color")]
    [JsonPropertyName("desc_color")]
    public int? DescriptionColor { get; set; }
    [System.Text.Json.Serialization.JsonConstructor]
    public WebhookTemplateCardSource(
        string? iconUrl = null,
        string? description = null,
        int? descriptionColor = 0)
    {
        IconUrl = iconUrl;
        Description = description;
        DescriptionColor = descriptionColor;
    }
    /// <summary>
    /// Tạo một kiểu nguồn thẻ màu xám
    /// </summary>
    /// <param name="iconUrl">URL hình ảnh nguồn</param>
    /// <param name="description">Mô tả hình ảnh nguồn</param>
    /// <returns></returns>
    public static WebhookTemplateCardSource Grey(string iconUrl, string? description = null)
    {
        return new WebhookTemplateCardSource(iconUrl, description, 0);
    }
    /// <summary>
    /// Tạo một kiểu nguồn thẻ màu đen
    /// </summary>
    /// <param name="iconUrl">URL hình ảnh nguồn</param>
    /// <param name="description">Mô tả hình ảnh nguồn</param>
    /// <returns></returns>
    public static WebhookTemplateCardSource Black(string iconUrl, string? description = null)
    {
        return new WebhookTemplateCardSource(iconUrl, description, 1);
    }
    /// <summary>
    /// Tạo một kiểu nguồn thẻ màu đỏ
    /// </summary>
    /// <param name="iconUrl">URL hình ảnh nguồn</param>
    /// <param name="description">Mô tả hình ảnh nguồn</param>
    /// <returns></returns>
    public static WebhookTemplateCardSource Red(string iconUrl, string? description = null)
    {
        return new WebhookTemplateCardSource(iconUrl, description, 2);
    }
    /// <summary>
    /// Tạo một kiểu nguồn thẻ màu xanh lá
    /// </summary>
    /// <param name="iconUrl">URL hình ảnh nguồn</param>
    /// <param name="description">Mô tả hình ảnh nguồn</param>
    /// <returns></returns>
    public static WebhookTemplateCardSource Green(string iconUrl, string? description = null)
    {
        return new WebhookTemplateCardSource(iconUrl, description, 3);
    }
}
