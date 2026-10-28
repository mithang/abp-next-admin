using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Authorize.Models;
/// <summary>
/// Thông tin người dùng WeChat Work
/// </summary>
public class WeChatWorkUserInfo
{
    /// <summary>
    /// UserID thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Phiếu thành viên, tối đa 512 byte, thời hạn hiệu lực là 1800s
    /// </summary>
    [NotNull]
    [JsonProperty("user_ticket")]
    [JsonPropertyName("user_ticket")]
    public string UserTicket { get; set; } = default!;
}
