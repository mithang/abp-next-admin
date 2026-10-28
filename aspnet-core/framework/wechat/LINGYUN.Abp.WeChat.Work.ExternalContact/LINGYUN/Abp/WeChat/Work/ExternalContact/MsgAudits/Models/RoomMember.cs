using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Models;
/// <summary>
/// Thành viên nhóm trò chuyện
/// </summary>
public class RoomMember
{
    /// <summary>
    /// Id của thành viên nhóm roomid, userid
    /// </summary>
    [NotNull]
    [JsonProperty("memberid")]
    [JsonPropertyName("memberid")]
    public string MemberId { get; set; } = default!;
    /// <summary>
    /// Thời gian tham gia nhóm của thành viên nhóm roomid
    /// </summary>
    [NotNull]
    [JsonProperty("jointime")]
    [JsonPropertyName("jointime")]
    public long JoinTime { get; set; }
}
