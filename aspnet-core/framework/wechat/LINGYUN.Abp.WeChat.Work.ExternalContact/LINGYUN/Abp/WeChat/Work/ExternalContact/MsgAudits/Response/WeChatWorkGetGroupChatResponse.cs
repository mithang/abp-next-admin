using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Response;
/// <summary>
/// Tham Số phản hồi thông tin nhóm nội bộ của lưu trữ nội dung phiên
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91782" />
/// </remarks>
public class WeChatWorkGetGroupChatResponse : WeChatWorkResponse
{
    /// <summary>
    /// Tên nhóm tương ứng với roomid
    /// </summary>
    [NotNull]
    [JsonProperty("roomname")]
    [JsonPropertyName("roomname")]
    public string RoomName { get; set; } = default!;
    /// <summary>
    /// Người tạo nhóm tương ứng với roomid, userid
    /// </summary>
    [NotNull]
    [JsonProperty("creator")]
    [JsonPropertyName("creator")]
    public string Creator { get; set; } = default!;
    /// <summary>
    /// Thời gian tạo nhóm tương ứng với roomid
    /// </summary>
    [NotNull]
    [JsonProperty("room_create_time")]
    [JsonPropertyName("room_create_time")]
    public long RoomCreateTime { get; set; }
    /// <summary>
    /// Thông báo nhóm tương ứng với roomid
    /// </summary>
    [CanBeNull]
    [JsonProperty("notice")]
    [JsonPropertyName("notice")]
    public string? Notice { get; set; }
    /// <summary>
    /// Danh sách thành viên nhóm tương ứng với roomid
    /// </summary>
    [NotNull]
    [JsonProperty("members")]
    [JsonPropertyName("members")]
    public RoomMember[] Members { get; set; } = default!;
}
