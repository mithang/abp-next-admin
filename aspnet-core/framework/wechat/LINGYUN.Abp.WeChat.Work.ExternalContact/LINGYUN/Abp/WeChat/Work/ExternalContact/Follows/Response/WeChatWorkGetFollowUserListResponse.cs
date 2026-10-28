using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Follows.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách thành viên đã cấu hình tính năng liên hệ khách hàng
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91853" />
/// </remarks>
public class WeChatWorkGetFollowUserListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách userid của thành viên đã cấu hình tính năng liên hệ khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("follow_user")]
    [JsonPropertyName("follow_user")]
    public List<string> FollowUser {  get; set; } = new List<string>();
}
