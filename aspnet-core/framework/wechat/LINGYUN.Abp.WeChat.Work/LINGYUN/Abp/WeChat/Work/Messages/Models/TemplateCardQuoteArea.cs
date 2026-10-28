using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Kiểu trích dẫn tài liệu
/// </summary>
public class TemplateCardQuoteArea
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TemplateCardQuoteArea(string url, string title = "", string text = "")
    {
        Type = 1;
        Url = url;
        Title = title;
        Text = text;
    }
    public TemplateCardQuoteArea(string appid, string pagePath, string title = "", string text = "")
    {
        Type = 2;
        AppId = appid;
        PagePath = pagePath;
        Title = title;
        Text = text;
    }
    /// <summary>
    /// Sự kiện nhấp vào vùng kiểu trích dẫn tài liệu, 0 hoặc không điền nghĩa là không có sự kiện nhấp, 1 nghĩa là chuyển đến url, 2 nghĩa là chuyển đến chương trình nhỏ
    /// </summary>
    [CanBeNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public byte? Type { get; }
    /// <summary>
    /// url chuyển đến khi nhấp, bắt buộc khi quote_area.type là 1
    /// </summary>
    [CanBeNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    /// <summary>
    /// appid của Mini Program WeChat chuyển đến khi nhấp, phải là Mini Program WeChat liên kết với ứng dụng hiện tại, bắt buộc khi quote_area.type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string? AppId { get; set; }
    /// <summary>
    /// pagepath của Mini Program WeChat chuyển đến khi nhấp, tùy chọn khi quote_area.type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("pagepath")]
    [JsonPropertyName("pagepath")]
    public string? PagePath { get; set; }
    /// <summary>
    /// Tiêu đề của kiểu trích dẫn tài liệu
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Văn bản trích dẫn của kiểu trích dẫn tài liệu
    /// </summary>
    [CanBeNull]
    [JsonProperty("quote_text")]
    [JsonPropertyName("quote_text")]
    public string? Text { get; set; }
}
