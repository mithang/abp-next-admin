using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tài liệu tham khảo trích dẫn
/// </summary>
public class WebhookTemplateCardQuoteArea
{
    /// <summary>
    /// Sự kiện nhấn vào vùng kiểu tài liệu tham khảo trích dẫn; 0 hoặc để trống nghĩa là không có sự kiện nhấn, 1 nghĩa là chuyển đến url, 2 nghĩa là chuyển đến mini program
    /// </summary>
    [CanBeNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public int? Type { get; set; }
    /// <summary>
    /// URL chuyển đến khi nhấn, bắt buộc khi type là 1
    /// </summary>
    [CanBeNull]
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
    /// Tiêu đề của kiểu tài liệu tham khảo trích dẫn
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Nội dung trích dẫn của kiểu tài liệu tham khảo trích dẫn
    /// </summary>
    [CanBeNull]
    [JsonProperty("quote_text")]
    [JsonPropertyName("quote_text")]
    public string? QuoteText { get; set; }
    [System.Text.Json.Serialization.JsonConstructor]
    public WebhookTemplateCardQuoteArea(
        string title,
        int? type = null,
        string? url = null,
        string? appId = null,
        string? pagePath = null,
        string? quoteText = null)
    {
        Title = title;
        QuoteText = quoteText;
        Type = type;
        Url = url;
        AppId = appId;
        PagePath = pagePath;
    }
    /// <summary>
    /// Tạo một tài liệu tham khảo trích dẫn mặc định
    /// </summary>
    /// <param name="title">Tiêu đề của kiểu tài liệu tham khảo trích dẫn</param>
    /// <param name="quoteText">Nội dung trích dẫn của kiểu tài liệu tham khảo trích dẫn</param>
    /// <returns></returns>
    public static WebhookTemplateCardQuoteArea Default(string title, string? quoteText = null)
    {
        Check.NotNullOrWhiteSpace(title, nameof(title));

        return new WebhookTemplateCardQuoteArea(title, quoteText: quoteText);
    }
    /// <summary>
    /// Tạo một tài liệu tham khảo trích dẫn chuyển đến liên kết
    /// </summary>
    /// <param name="title">Tiêu đề của kiểu tài liệu tham khảo trích dẫn</param>
    /// <param name="url">URL chuyển đến khi nhấn</param>
    /// <param name="quoteText">Nội dung trích dẫn của kiểu tài liệu tham khảo trích dẫn</param>
    /// <returns></returns>
    public static WebhookTemplateCardQuoteArea Link(string title, string url, string? quoteText = null)
    {
        Check.NotNullOrWhiteSpace(title, nameof(title));
        Check.NotNullOrWhiteSpace(url, nameof(url));

        return new WebhookTemplateCardQuoteArea(title, 1, url, quoteText: quoteText);
    }
    /// <summary>
    /// Tạo một tài liệu tham khảo trích dẫn chuyển đến mini program
    /// </summary>
    /// <param name="title">Tiêu đề của kiểu tài liệu tham khảo trích dẫn</param>
    /// <param name="appId">AppId của mini program của liên kết chuyển đến</param>
    /// <param name="pagePath">PagePath của mini program của liên kết chuyển đến</param>
    /// <param name="quoteText">Nội dung trích dẫn của kiểu tài liệu tham khảo trích dẫn</param>
    /// <returns></returns>
    public static WebhookTemplateCardQuoteArea MiniProgram(string title, string appId, string pagePath, string? quoteText = null)
    {
        Check.NotNullOrWhiteSpace(title, nameof(title));
        Check.NotNullOrWhiteSpace(appId, nameof(appId));
        Check.NotNullOrWhiteSpace(pagePath, nameof(pagePath));

        return new WebhookTemplateCardQuoteArea(title, 2, appId: appId, pagePath: pagePath, quoteText: quoteText);
    }
}
