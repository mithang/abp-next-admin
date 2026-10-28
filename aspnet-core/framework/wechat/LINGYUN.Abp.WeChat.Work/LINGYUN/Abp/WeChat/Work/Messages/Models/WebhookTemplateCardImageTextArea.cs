using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Kiểu trái ảnh phải chữ
/// </summary>
public class WebhookTemplateCardImageTextArea
{
    /// <summary>
    /// Sự kiện nhấn vào vùng kiểu trái ảnh phải chữ; 0 hoặc để trống nghĩa là không có sự kiện nhấn, 1 nghĩa là chuyển đến url, 2 nghĩa là chuyển đến mini program
    /// </summary>
    [CanBeNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public int? Type { get; set; }
    /// <summary>
    /// URL hình ảnh của kiểu trái ảnh phải chữ
    /// </summary>
    [NotNull]
    [JsonProperty("image_url")]
    [JsonPropertyName("image_url")]
    public string ImageUrl { get; set; }
    /// <summary>
    /// URL chuyển đến khi nhấn, bắt buộc khi type là 1
    /// </summary>
    [NotNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    /// <summary>
    /// AppId của mini program chuyển đến khi nhấn, bắt buộc khi type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string? AppId { get; set; }
    /// <summary>
    /// PagePath của mini program chuyển đến khi nhấn, tùy chọn khi type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("pagepath")]
    [JsonPropertyName("pagepath")]
    public string? PagePath { get; set; }
    /// <summary>
    /// Tiêu đề của kiểu trái ảnh phải chữ
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Mô tả của kiểu trái ảnh phải chữ
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string? Description { get; set; }
    [System.Text.Json.Serialization.JsonConstructor]
    public WebhookTemplateCardImageTextArea(
        string imageUrl,
        int? type = null, 
        string? url = null,
        string? appId = null,
        string? pagePath = null,
        string? title = null,
        string? description = null)
    {
        Type = type;
        ImageUrl = imageUrl;
        Url = url;
        AppId = appId;
        PagePath = pagePath;
        Title = title;
        Description = description;
    }
    /// <summary>
    /// Tạo một kiểu trái ảnh phải chữ chuyển đến liên kết
    /// </summary>
    /// <param name="imageUrl">URL hình ảnh của kiểu trái ảnh phải chữ</param>
    /// <param name="url">URL chuyển đến khi nhấn</param>
    /// <param name="title">Tiêu đề của kiểu trái ảnh phải chữ</param>
    /// <param name="description">Mô tả của kiểu trái ảnh phải chữ</param>
    /// <returns></returns>
    public static WebhookTemplateCardImageTextArea Link(
        string imageUrl,
        string url,
        string? title = null,
        string? description = null)
    {
        Check.NotNullOrWhiteSpace(imageUrl, nameof(imageUrl));
        Check.NotNullOrWhiteSpace(url, nameof(url));

        return new WebhookTemplateCardImageTextArea(imageUrl, 1, url: url, title: title, description: description);
    }
    /// <summary>
    /// Tạo một kiểu trái ảnh phải chữ chuyển đến mini program
    /// </summary>
    /// <param name="imageUrl">URL hình ảnh của kiểu trái ảnh phải chữ</param>
    /// <param name="appId">AppId của mini program</param>
    /// <param name="pagePath">PagePath của mini program</param>
    /// <param name="title">Tiêu đề của kiểu trái ảnh phải chữ</param>
    /// <param name="description">Mô tả của kiểu trái ảnh phải chữ</param>
    /// <returns></returns>
    public static WebhookTemplateCardImageTextArea MiniProgram(
        string imageUrl, 
        string appId, 
        string pagePath,
        string? title = null,
        string? description = null)
    {
        Check.NotNullOrWhiteSpace(imageUrl, nameof(imageUrl));
        Check.NotNullOrWhiteSpace(appId, nameof(appId));
        Check.NotNullOrWhiteSpace(pagePath, nameof(pagePath));

        return new WebhookTemplateCardImageTextArea(imageUrl, 2, appId: appId, pagePath: pagePath, title: title, description: description);
    }
}
