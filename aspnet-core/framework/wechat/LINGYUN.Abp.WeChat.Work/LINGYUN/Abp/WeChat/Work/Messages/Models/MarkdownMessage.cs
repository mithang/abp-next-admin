using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn markdown
/// </summary>
public class MarkdownMessage
{
    /// <summary>
    /// Nội dung markdown, dài tối đa 2048 byte, phải được mã hóa utf8
    /// </summary>
    [NotNull]
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public string Content { get; set; }
    public MarkdownMessage(string content)
    {
        Content = content;
    }
}
