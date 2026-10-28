using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Models;
public class WeChatWorkMessage
{
    /// <summary>
    /// Chữ ký mã hóa của WeChat doanh nghiệp,
    /// msg_signature được tính bằng cách kết hợp token do doanh nghiệp điền, timestamp và nonce trong yêu cầu, cùng với nội dung tin nhắn đã mã hóa
    /// </summary>
    /// <remarks>
    /// Phương pháp tính chữ ký tham khảo tại: https://developer.work.weixin.qq.com/document/path/90930#12976/%E6%B6%88%E6%81%AF%E4%BD%93%E7%AD%BE%E5%90%8D%E6%A0%A1%E9%AA%8C
    /// </remarks>
    [Required]
    [JsonPropertyName("msg_signature")]
    public string MsgSignature { get; set; } = default!;
    /// <summary>
    /// Dấu thời gian. Dùng kết hợp với nonce để ngăn chặn tấn công phát lại yêu cầu.
    /// </summary>
    [Required]
    [JsonPropertyName("timestamp")]
    public int TimeStamp { get; set; }
    /// <summary>
    /// Số ngẫu nhiên. Dùng kết hợp với timestamp để ngăn chặn tấn công phát lại yêu cầu.
    /// </summary>
    [Required]
    [JsonPropertyName("nonce")]
    public string Nonce { get; set; } = default!;
}
