using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Sự kiện chuyển hướng khi nhấp vào thẻ
/// </summary>
public class WebhookTemplateCardAction
{
    /// <summary>
    /// Loại chuyển hướng của thẻ, 1 nghĩa là chuyển đến url, 2 nghĩa là mở chương trình mini. Trong thẻ mẫu text_notice, phạm vi giá trị của trường này là [1,2]
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public int Type { get; set; }
    /// <summary>
    /// Url của liên kết chuyển hướng, bắt buộc khi type là 1
    /// </summary>
    [CanBeNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    /// <summary>
    /// Appid của chương trình mini chuyển đến khi nhấp vào, bắt buộc khi type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string? AppId { get; set; }
    /// <summary>
    /// Pagepath của chương trình mini chuyển đến khi nhấp vào, tùy chọn khi type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("pagepath")]
    [JsonPropertyName("pagepath")]
    public string? PagePath { get; set; }
    [System.Text.Json.Serialization.JsonConstructor]
    public WebhookTemplateCardAction(
        int type,
        string? url = null,
        string? appId = null,
        string? pagePath = null)
    {
        Type = type;
        Url = url;
        AppId = appId;
        PagePath = pagePath;
    }
    /// <summary>
    /// Tạo một sự kiện thẻ liên kết chuyển hướng
    /// </summary>
    /// <param name="url">Url của liên kết chuyển hướng</param>
    /// <returns></returns>
    public static WebhookTemplateCardAction Link(string url)
    {
        Check.NotNullOrWhiteSpace(url, nameof(url));

        return new WebhookTemplateCardAction(1, url);
    }
    /// <summary>
    /// Tạo một sự kiện thẻ chương trình mini chuyển hướng
    /// </summary>
    /// <param name="appId">Appid của chương trình mini</param>
    /// <param name="pagePath">PagePath của chương trình mini</param>
    /// <returns></returns>
    public static WebhookTemplateCardAction MiniProgram(string appId, string pagePath)
    {
        Check.NotNullOrWhiteSpace(appId, nameof(appId));
        Check.NotNullOrWhiteSpace(pagePath, nameof(pagePath));

        return new WebhookTemplateCardAction(2, appId: appId, pagePath: pagePath);
    }
}
