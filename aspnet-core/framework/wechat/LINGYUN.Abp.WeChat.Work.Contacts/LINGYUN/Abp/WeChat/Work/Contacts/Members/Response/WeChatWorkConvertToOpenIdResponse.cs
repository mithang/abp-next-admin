using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi chuyển userid sang openid
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90202" />
/// </remarks>
public class WeChatWorkConvertToOpenIdResponse : WeChatWorkResponse
{
    /// <summary>
    /// Openid tương ứng với userid thành viên WeChat Doanh nghiệp
    /// </summary>
    [NotNull]
    [JsonProperty("openid")]
    [JsonPropertyName("openid")]
    public string OpenId { get; set; } = default!;
}
