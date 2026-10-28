using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
/// <summary>
/// Chi tiết nhóm khách hàng
/// </summary>
public class GroupChatInfo
{
    /// <summary>
    /// ID nhóm khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("chat_id")]
    [JsonPropertyName("chat_id")]
    public string ChatId { get; set; } = default!;
    /// <summary>
    /// Tên nhóm
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    /// <summary>
    /// ID chủ nhóm
    /// </summary>
    [NotNull]
    [JsonProperty("owner")]
    [JsonPropertyName("owner")]
    public string Owner { get; set; } = default!;
    /// <summary>
    /// Thời gian tạo nhóm
    /// </summary>
    [NotNull]
    [JsonProperty("create_time")]
    [JsonPropertyName("create_time")]
    public long CreateTime { get; set; }
    /// <summary>
    /// Thông báo nhóm
    /// </summary>
    [CanBeNull]
    [JsonProperty("notice")]
    [JsonPropertyName("notice")]
    public string? Notice { get; set; }
    /// <summary>
    /// Danh sách thành viên nhóm
    /// </summary>
    [NotNull]
    [JsonProperty("member_list")]
    [JsonPropertyName("member_list")]
    public GroupChatMember[] MemberList { get; set; } = default!;
    /// <summary>
    /// Danh sách quản trị viên nhóm
    /// </summary>
    [NotNull]
    [JsonProperty("admin_list")]
    [JsonPropertyName("admin_list")]
    public GroupChatManager[] AdminList { get; set; } = default!;
    /// <summary>
    /// Số phiên bản thành viên nhóm hiện tại. Có thể kết hợp với sự kiện thay đổi nhóm khách hàng để giảm số lần chủ động gọi API này
    /// </summary>
    [NotNull]
    [JsonProperty("member_version")]
    [JsonPropertyName("member_version")]
    public string MemberVersion { get; set; } = default!;
}
