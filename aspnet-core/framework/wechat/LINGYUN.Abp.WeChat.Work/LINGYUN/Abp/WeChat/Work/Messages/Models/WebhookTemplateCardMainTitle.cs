using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Nội dung chính của thẻ mẫu
/// </summary>
public class WebhookTemplateCardMainTitle
{
    /// <summary>
    /// Tiêu đề cấp một, nên không vượt quá 26 ký tự. Tiêu đề cấp một main_title.title và văn bản thường cấp hai sub_title_text trong nội dung chính của thẻ mẫu phải điền ít nhất một mục
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Thông tin phụ của tiêu đề, nên không vượt quá 30 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string? Description { get; set; }
    /// <summary>
    /// Tạo nội dung chính của một thẻ mẫu
    /// </summary>
    /// <param name="title">Tiêu đề cấp một</param>
    /// <param name="description">Thông tin phụ của tiêu đề</param>
    public WebhookTemplateCardMainTitle(string title, string? description = null)
    {
        Title = title;
        Description = description;
    }
}
