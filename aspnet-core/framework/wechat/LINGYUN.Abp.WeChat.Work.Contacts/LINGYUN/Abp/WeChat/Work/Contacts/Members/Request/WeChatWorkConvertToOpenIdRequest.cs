using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Request;
/// <summary>
/// Tham số yêu cầu chuyển userid sang openid
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90202" />
/// </remarks>
public class WeChatWorkConvertToOpenIdRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id thành viên trong doanh nghiệp
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; }
    public WeChatWorkConvertToOpenIdRequest(string userId)
    {
        UserId = Check.NotNullOrWhiteSpace(userId, nameof(userId));
    }
}
