using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Request;
/// <summary>
/// Tham số yêu cầu chuyển openid sang userid
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90202" />
/// </remarks>
public class WeChatWorkConvertToUserIdRequest : WeChatWorkRequest
{
    /// <summary>
    /// openid của kết quả trả về sau khi sử dụng thanh toán doanh nghiệp
    /// </summary>
    [NotNull]
    [JsonProperty("openid")]
    [JsonPropertyName("openid")]
    public string OpenId { get; }
    public WeChatWorkConvertToUserIdRequest(string openId)
    {
        OpenId = Check.NotNullOrWhiteSpace(openId, nameof(openId));
    }
}

