using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Account.Models;
public class TicketModel
{
    /// <summary>
    /// Ticket mã QR đã lấy; với ticket này có thể đổi lấy mã QR trong thời gian hiệu lực
    /// </summary>
    [JsonProperty("ticket")]
    [JsonPropertyName("ticket")]
    public string Ticket { get; set; } = default!;
    /// <summary>
    /// Thời gian hiệu lực của mã QR này, tính bằng giây. Tối đa không vượt quá 2592000 (tức 30 ngày).
    /// </summary>
    [JsonProperty("expire_seconds")]
    [JsonPropertyName("expire_seconds")]
    public int ExpireSeconds { get; set; }
    /// <summary>
    /// Địa chỉ sau khi phân tích hình ảnh mã QR; nhà phát triển có thể tự tạo hình ảnh mã QR cần thiết dựa trên địa chỉ này
    /// </summary>
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string Url { get; set; } = default!;
}
