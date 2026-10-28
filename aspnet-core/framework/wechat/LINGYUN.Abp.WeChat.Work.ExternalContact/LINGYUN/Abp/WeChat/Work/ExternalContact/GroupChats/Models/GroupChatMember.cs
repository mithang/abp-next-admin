using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
/// <summary>
/// Thành viên nhóm
/// </summary>
public class GroupChatMember
{
    /// <summary>
    /// Thành viên nhómid
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Loại thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public GroupChatMemberType Type { get; set; }
    /// <summary>
    /// Định danh duy nhất của liên hệ bên ngoài trên nền tảng mở WeChat (unionid WeChat), qua trường này doanh nghiệp có thể liên kết liên hệ bên ngoài với người dùng tài khoản công khai / chương trình mini.<br />
    /// Chỉ có trường này khi loại thành viên nhóm là người dùng WeChat (bao gồm thành viên doanh nghiệp chưa kết bạn), và doanh nghiệp đã liên kết ID nhà phát triển WeChat
    /// </summary>
    [CanBeNull]
    [JsonProperty("unionid")]
    [JsonPropertyName("unionid")]
    public string? UnionId { get; set; }
    /// <summary>
    /// Thời gian vào nhóm
    /// </summary>
    [NotNull]
    [JsonProperty("join_time")]
    [JsonPropertyName("join_time")]
    public long JoinTime { get; set; }
    /// <summary>
    /// Cách vào nhóm
    /// </summary>
    [NotNull]
    [JsonProperty("join_scene")]
    [JsonPropertyName("join_scene")]
    public GroupChatMemberJoinScene JoinScene { get; set; }
    /// <summary>
    /// Người mời. Hiện tại chỉ trả về giá trị này khi được thành viên nội bộ của doanh nghiệp mời vào nhóm
    /// </summary>
    [CanBeNull]
    [JsonProperty("invitor")]
    [JsonPropertyName("invitor")]
    public GroupChatInvitor? Invitor { get; set; }
    /// <summary>
    /// Biệt danh trong nhóm
    /// </summary>
    [CanBeNull]
    [JsonProperty("group_nickname")]
    [JsonPropertyName("group_nickname")]
    public string? GroupNickname { get; set; }
    /// <summary>
    /// Tên. Chỉ trả về khi need_name = 1<br />
    /// Nếu là người dùng WeChat, sẽ trả về tên mà người đó đặt trong WeChat<br />
    /// Nếu là liên hệ WeChat doanh nghiệp, sẽ trả về bí danh hoặc tên thật mà người đó đặt để hiển thị ra bên ngoài
    /// </summary>
    [CanBeNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }
}
