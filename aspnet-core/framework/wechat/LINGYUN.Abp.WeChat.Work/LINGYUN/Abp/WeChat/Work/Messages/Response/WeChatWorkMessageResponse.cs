using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Response;
/// <summary>
/// Phản hồi gửi tin nhắn của WeChat Doanh nghiệp
/// </summary>
public class WeChatWorkMessageResponse : WeChatWorkResponse
{
    /// <summary>
    /// Userid không hợp lệ, không phân biệt chữ hoa chữ thường, thống nhất chuyển thành chữ thường
    /// </summary>
    [JsonProperty("invaliduser")]
    [JsonPropertyName("invaliduser")]
    public string? InvalidUser { get; set; }
    /// <summary>
    /// Partyid không hợp lệ
    /// </summary>
    [JsonProperty("invalidparty")]
    [JsonPropertyName("invalidparty")]
    public string? InvalidParty { get; set; }
    /// <summary>
    /// Id nhãn không hợp lệ
    /// </summary>
    [JsonProperty("invalidtag")]
    [JsonPropertyName("invalidtag")]
    public string? InvalidTag { get; set; }
    /// <summary>
    /// Userid không có quyền giao diện cơ bản (bao gồm đã hết hạn)
    /// </summary>
    [JsonProperty("unlicenseduser")]
    [JsonPropertyName("unlicenseduser")]
    public string? UnLicensedUser { get; set; }
    /// <summary>
    /// Id tin nhắn, dùng để thu hồi tin nhắn ứng dụng
    /// </summary>
    [JsonProperty("msgid")]
    [JsonPropertyName("msgid")]
    public string? MsgId { get; set; }
    /// <summary>
    /// Chỉ trả về đối với tin nhắn thẻ mẫu có loại tin nhắn là "kiểu tương tác nút", "kiểu bình chọn" và "kiểu lựa chọn nhiều mục",
    /// Ứng dụng có thể dùng response_code để gọi giao diện cập nhật tin nhắn thẻ mẫu, có hiệu lực trong 72 giờ và chỉ được sử dụng một lần
    /// </summary>
    [JsonProperty("response_code")]
    [JsonPropertyName("response_code")]
    public string? ResponseCode { get; set; }
}
