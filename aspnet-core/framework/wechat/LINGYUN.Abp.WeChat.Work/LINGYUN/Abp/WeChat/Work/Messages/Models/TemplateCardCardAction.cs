using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Sự kiện chuyển hướng khi nhấn vào toàn bộ thẻ
/// </summary>
public class TemplateCardCardAction
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TemplateCardCardAction(string url)
    {
        Type = 1;
        Url = url;
    }

    public TemplateCardCardAction(string appid, string pagePath)
    {
        Type = 2;
        AppId = appid;
        PagePath = pagePath;
    }
    /// <summary>
    /// Loại liên kết chuyển hướng, 0 hoặc không điền nghĩa là không phải liên kết, 1 nghĩa là chuyển hướng tới url, 2 nghĩa là chuyển hướng tới chương trình mini
    /// </summary>
    [CanBeNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public byte Type { get; set; }
    /// <summary>
    /// Url của liên kết chuyển hướng, bắt buộc khi card_action.type là 1
    /// </summary>
    [CanBeNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    /// <summary>
    /// Appid của chương trình mini của liên kết chuyển hướng, phải là chương trình mini liên kết với ứng dụng hiện tại, bắt buộc khi card_action.type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string? AppId { get; set; }
    /// <summary>
    /// Pagepath của chương trình mini của liên kết chuyển hướng, tùy chọn khi card_action.type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("pagepath")]
    [JsonPropertyName("pagepath")]
    public string? PagePath { get; set; }
}
