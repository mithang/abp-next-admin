using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi chuyển openid sang userid
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90202" />
/// </remarks>
public class WeChatWorkConvertToUserIdResponse : WeChatWorkResponse
{
    /// <summary>
    /// userid thành viên tương ứng với openid này trong WeChat Work
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
}
