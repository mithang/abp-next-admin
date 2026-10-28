using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Request;
/// <summary>
/// Tham số yêu cầu lấy userid qua email
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/95402" />
/// </remarks>
public class WeChatWorkGetUserIdByEmailRequest : WeChatWorkRequest
{
    /// <summary>
    /// Email
    /// </summary>
    [NotNull]
    [JsonProperty("email")]
    [JsonPropertyName("email")]
    public string Email { get; }
    /// <summary>
    /// Loại email
    /// </summary>
    [CanBeNull]
    [JsonProperty("email_type")]
    [JsonPropertyName("email_type")]
    public EmailType? EmailType { get; }
    public WeChatWorkGetUserIdByEmailRequest(string email, EmailType? emailType = null)
    {
        Email = Check.NotNullOrWhiteSpace(email, nameof(email));
        EmailType = emailType;
    }
}
