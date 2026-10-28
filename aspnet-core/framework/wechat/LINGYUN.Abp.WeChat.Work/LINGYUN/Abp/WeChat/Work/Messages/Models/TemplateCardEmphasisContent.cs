using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Kiểu dữ liệu quan trọng
/// </summary>
public class TemplateCardEmphasisContent
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TemplateCardEmphasisContent(
        string title = "", 
        string description = "")
    {
        Title = title;
        Description = description;
    }

    /// <summary>
    /// Nội dung dữ liệu của kiểu dữ liệu quan trọng, khuyến nghị không vượt quá 14 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Nội dung mô tả dữ liệu của kiểu dữ liệu quan trọng, khuyến nghị không vượt quá 22 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("desc")]
    [JsonPropertyName("desc")]
    public string? Description { get; set; }
}
