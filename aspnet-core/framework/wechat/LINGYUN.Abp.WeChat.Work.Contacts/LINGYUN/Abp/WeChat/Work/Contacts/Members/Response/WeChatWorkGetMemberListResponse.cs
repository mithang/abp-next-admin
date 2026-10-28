using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi lấy chi tiết thành viên phòng ban
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90201" />
/// </remarks>
public class WeChatWorkGetMemberListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("userlist")]
    [JsonPropertyName("userlist")]
    public MemberInfo[] UserList { get; set; } = default!;
}
