using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Authorize.Response;
/// <summary>
/// Phản hồi thông tin người dùng WeChat Doanh nghiệp
/// </summary>
public class WeChatWorkUserInfoResponse : WeChatWorkResponse
{
    /// <summary>
    /// UserID thành viên
    /// </summary>
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Ticket thành viên, tối đa 512 byte, thời hạn hiệu lực 1800s
    /// </summary>
    [JsonProperty("user_ticket")]
    [JsonPropertyName("user_ticket")]
    public string UserTicket { get; set; } = default!;
}
