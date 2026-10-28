using LINGYUN.Abp.WeChat.Work.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Message;
public class MessageValidationInput : WeChatWorkMessage
{
    /// <summary>
    /// Chuỗi đã mã hóa. Cần giải mã để lấy nội dung tin nhắn dạng plaintext, sau khi giải mã có bốn trường random, msg_len, msg, receiveid, trong đó msg chính là nội dung tin nhắn dạng plaintext
    /// </summary>
    [Required]
    [JsonPropertyName("echostr")]
    public string EchoStr { get; set; } = default!;
}
