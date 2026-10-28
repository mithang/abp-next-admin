using JetBrains.Annotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn Markdown Webhook
/// </summary>
public class WebhookMarkdownMessage
{
    /// <summary>
    /// Nội dung markdown, dài tối đa 4096 byte, phải sử dụng mã hóa utf8
    /// </summary>
    [NotNull]
    [StringLength(4096)]
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public string Content { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn Markdown Webhook
    /// </summary>
    /// <param name="content">Nội dung markdown, dài tối đa 4096 byte, phải sử dụng mã hóa utf8</param>
    public WebhookMarkdownMessage(string content)
    {
        Content = Check.NotNullOrWhiteSpace(content, nameof(content), 4096);
    }
}
