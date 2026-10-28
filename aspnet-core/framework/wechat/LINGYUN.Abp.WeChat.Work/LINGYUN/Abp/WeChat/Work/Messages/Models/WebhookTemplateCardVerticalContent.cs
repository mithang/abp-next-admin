using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Nội dung dọc cấp hai của thẻ
/// </summary>
public class WebhookTemplateCardVerticalContent
{
    /// <summary>
    /// Tiêu đề cấp hai của thẻ, nên không vượt quá 26 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Văn bản thường cấp hai, nên không vượt quá 112 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string? Description { get; set; }
    /// <summary>
    /// Tạo một nội dung dọc cấp hai của thẻ
    /// </summary>
    /// <param name="title">Tiêu đề cấp hai của thẻ</param>
    /// <param name="description">Văn bản thường cấp hai</param>
    public WebhookTemplateCardVerticalContent(string title, string? description = null)
    {
        Title = title;
        Description = description;
    }
}
