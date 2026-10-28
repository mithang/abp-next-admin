using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi lấy thành viên phòng ban
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90200" />
/// </remarks>
public class WeChatWorkGetSimpleMemberListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("userlist")]
    [JsonPropertyName("userlist")]
    public DepartmentMember[] UserList { get; set; } = default!;
}
