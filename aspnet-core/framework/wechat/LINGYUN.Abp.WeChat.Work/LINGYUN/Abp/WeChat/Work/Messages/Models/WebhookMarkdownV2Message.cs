using JetBrains.Annotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn Webhook MarkdownV2
/// </summary>
public class WebhookMarkdownV2Message
{
    /// <summary>
    /// Nội dung markdown_v2, tối đa 4096 byte, phải được mã hóa utf8.
    /// </summary>
    /// <remarks>
    /// 1. markdown_v2 không hỗ trợ màu phông chữ, cú pháp @thành viên nhóm; cú pháp được hỗ trợ cụ thể có thể tham khảo phần giải thích bên dưới<br />
    /// 2. Nội dung tin nhắn trên phiên bản client dưới 4.1.36 (phía Android là dưới 4.1.38) sẽ hiển thị dưới dạng văn bản thuần; nên sử dụng phiên bản client mới nhất để trải nghiệm
    /// </remarks>
    [NotNull]
    [StringLength(4096)]
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public string Content { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn Webhook MarkdownV2
    /// </summary>
    /// <param name="content">Nội dung markdown_v2, tối đa 4096 byte, phải được mã hóa utf8</param>
    public WebhookMarkdownV2Message(string content)
    {
        Content = Check.NotNullOrWhiteSpace(content, nameof(content), 4096);
    }
}
