using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Models;
public class WeChatMessage
{
    /// <summary>
    /// Chữ ký mã hóa của WeChat,
    /// signature kết hợp tham số token do nhà phát triển điền với các tham số timestamp và nonce trong yêu cầu
    /// </summary>
    /// <remarks>
    /// Phương pháp tính chữ ký tham khảo tại: https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/Before_Develop/Message_encryption_and_decryption.html
    /// </remarks>
    [JsonPropertyName("signature")]
    public string Signature { get; set; } = default!;
    /// <summary>
    /// Dấu thời gian. Dùng kết hợp với nonce để ngăn chặn tấn công phát lại yêu cầu.
    /// </summary>
    [JsonPropertyName("timestamp")]
    public int TimeStamp { get; set; }
    /// <summary>
    /// Số ngẫu nhiên. Dùng kết hợp với timestamp để ngăn chặn tấn công phát lại yêu cầu.
    /// </summary>
    [JsonPropertyName("nonce")]
    public string Nonce { get; set; } = default!;
}
