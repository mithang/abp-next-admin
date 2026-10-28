using LINGYUN.Abp.WeChat.Official.Models;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Message;
public class MessageValidationInput : WeChatMessage
{
    /// <summary>
    /// Chuỗi đã mã hóa. Cần giải mã để lấy nội dung tin nhắn dạng plaintext, sau khi giải mã có bốn trường random, msg_len, msg, receiveid, trong đó msg chính là nội dung tin nhắn dạng plaintext
    /// </summary>
    [JsonPropertyName("echostr")]
    public string EchoStr { get; set; } = default!;
}
