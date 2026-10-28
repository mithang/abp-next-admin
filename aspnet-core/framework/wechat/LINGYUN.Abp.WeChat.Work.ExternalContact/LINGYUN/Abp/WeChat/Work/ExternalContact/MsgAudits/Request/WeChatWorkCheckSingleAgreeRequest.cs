using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Request;
/// <summary>
/// Tham số yêu cầu lấy tình hình đồng ý của phiên trò chuyện riêng
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/91782" />
/// </remarks>
public class WeChatWorkCheckSingleAgreeRequest : WeChatWorkRequest
{
    /// <summary>
    /// userid của thành viên nội bộ
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; }
    /// <summary>
    /// exteranalopenid của thành viên bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("exteranalopenid")]
    [JsonPropertyName("exteranalopenid")]
    public string ExteranalOpenId { get; }
    public WeChatWorkCheckSingleAgreeRequest(string userId, string exteranalOpenId)
    {
        UserId = userId;
        ExteranalOpenId = exteranalOpenId;
    }
}
