using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Kiểu hướng dẫn chuyển hướng
/// </summary>
public class WebhookTemplateCardJump
{
    /// <summary>
    /// Loại liên kết chuyển hướng, 0 hoặc để trống nghĩa là không phải liên kết, 1 nghĩa là chuyển hướng tới url, 2 nghĩa là chuyển hướng tới mini program
    /// </summary>
    [CanBeNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public int? Type { get; set; }
    /// <summary>
    /// Nội dung văn bản của kiểu liên kết chuyển hướng, nên không quá 13 ký tự
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; }
    /// <summary>
    /// url của liên kết chuyển hướng, bắt buộc khi type là 1
    /// </summary>
    [CanBeNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    /// <summary>
    /// appid của mini program được chuyển hướng tới khi nhấp, bắt buộc khi type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string? AppId { get; set; }
    /// <summary>
    /// pagepath của mini program được chuyển hướng tới khi nhấp, tùy chọn khi type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("pagepath")]
    [JsonPropertyName("pagepath")]
    public string? PagePath { get; set; }
    [System.Text.Json.Serialization.JsonConstructor]
    public WebhookTemplateCardJump(
        string title,
        int? type = null,
        string? url = null,
        string? appId = null,
        string? pagePath = null)
    {
        Type = type;
        Title = title;
        Url = url;
        AppId = appId;
        PagePath = pagePath;
    }
    /// <summary>
    /// Tạo một kiểu hướng dẫn mặc định
    /// </summary>
    /// <param name="title">Nội dung văn bản của kiểu liên kết chuyển hướng</param>
    /// <returns></returns>
    public static WebhookTemplateCardJump Default(string title)
    {
        Check.NotNullOrWhiteSpace(title, nameof(title));

        return new WebhookTemplateCardJump(title);
    }
    /// <summary>
    /// Tạo một kiểu hướng dẫn liên kết chuyển hướng
    /// </summary>
    /// <param name="title">Nội dung văn bản của kiểu liên kết chuyển hướng</param>
    /// <param name="url">url của liên kết chuyển hướng</param>
    /// <returns></returns>
    public static WebhookTemplateCardJump Link(string title, string url)
    {
        Check.NotNullOrWhiteSpace(title, nameof(title));
        Check.NotNullOrWhiteSpace(url, nameof(url));

        return new WebhookTemplateCardJump(title, 1, url);
    }
    /// <summary>
    /// Tạo một kiểu hướng dẫn chuyển hướng tới mini program
    /// </summary>
    /// <param name="title">Nội dung văn bản của kiểu liên kết chuyển hướng</param>
    /// <param name="appId">appid của mini program của liên kết chuyển hướng</param>
    /// <param name="pagePath">pagepath của mini program của liên kết chuyển hướng</param>
    /// <returns></returns>
    public static WebhookTemplateCardJump MiniProgram(string title, string appId, string pagePath)
    {
        Check.NotNullOrWhiteSpace(title, nameof(title));
        Check.NotNullOrWhiteSpace(appId, nameof(appId));
        Check.NotNullOrWhiteSpace(pagePath, nameof(pagePath));

        return new WebhookTemplateCardJump(title, 2, appId: appId, pagePath: pagePath);
    }
}
