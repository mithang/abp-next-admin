using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tiêu đề thẻ
/// </summary>
public class TemplateCardMainTitle
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TemplateCardMainTitle(
        string title = "", 
        string description = "")
    {
        Title = title;
        Description = description;
    }

    /// <summary>
    /// Tiêu đề cấp một, nên không vượt quá 36 ký tự; với thẻ dạng thông báo văn bản thì trường này không bắt buộc, nhưng không được để trống cả trường này và sub_title_text (hỗ trợ chuyển đổi id)
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Thông tin phụ trợ của tiêu đề, nên không vượt quá 44 ký tự (hỗ trợ chuyển đổi id)
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string? Description { get; set; }
}
