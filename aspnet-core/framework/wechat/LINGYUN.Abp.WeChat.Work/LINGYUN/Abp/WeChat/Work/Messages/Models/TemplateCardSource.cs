using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Màu chữ nguồn
/// </summary>
public enum DescriptionColor
{
    Gray = 0,
    Black = 1,
    Red = 2,
    Green = 3,
}
/// <summary>
/// Thông tin kiểu nguồn của thẻ
/// </summary>
public class TemplateCardSource
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TemplateCardSource(
        string iconUrl = "", 
        string description = "",
        DescriptionColor descriptionColor = DescriptionColor.Gray)
    {
        IconUrl = iconUrl;
        Description = description;
        DescriptionColor = descriptionColor;
    }

    /// <summary>
    /// Url hình ảnh nguồn, kích thước hình ảnh nguồn khuyến nghị là 72*72
    /// </summary>
    [CanBeNull]
    [JsonProperty("icon_url")]
    [JsonPropertyName("icon_url")]
    public string IconUrl { get; set; }
    /// <summary>
    /// Mô tả hình ảnh nguồn, khuyến nghị không quá 20 ký tự (hỗ trợ chuyển đổi id)
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string Description { get; set; }
    /// <summary>
    /// Màu chữ nguồn, hiện hỗ trợ: 0 (mặc định) xám, 1 đen, 2 đỏ, 3 xanh lá
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc_color")]
    [JsonPropertyName("desc_color")]
    public DescriptionColor DescriptionColor { get; set; }
}
