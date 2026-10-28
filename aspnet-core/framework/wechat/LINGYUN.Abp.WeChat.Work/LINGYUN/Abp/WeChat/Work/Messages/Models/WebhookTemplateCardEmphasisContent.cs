using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Kiểu dữ liệu quan trọng
/// </summary>
public class WebhookTemplateCardEmphasisContent
{
    /// <summary>
    /// Nội dung dữ liệu của kiểu dữ liệu quan trọng, nên không vượt quá 10 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Nội dung mô tả dữ liệu của kiểu dữ liệu quan trọng, nên không vượt quá 15 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string? Description { get; set; }
    /// <summary>
    /// Tạo một kiểu dữ liệu quan trọng
    /// </summary>
    /// <param name="title">Nội dung dữ liệu của kiểu dữ liệu quan trọng</param>
    /// <param name="description">Nội dung mô tả dữ liệu của kiểu dữ liệu quan trọng</param>
    public WebhookTemplateCardEmphasisContent(string title, string? description = null)
    {
        Title = title;
        Description = description;
    }
}
