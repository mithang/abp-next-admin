using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
/// <summary>
/// Nhóm khách hàng
/// </summary>
public class GroupChat
{
    /// <summary>
    /// ID nhóm khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("chat_id")]
    [JsonPropertyName("chat_id")]
    public string ChatId { get; set; } = default!;
    /// <summary>
    /// Trạng thái theo dõi nhóm khách hàng
    /// </summary>
    [NotNull]
    [JsonProperty("status")]
    [JsonPropertyName("status")]
    public GroupChatStatus Status { get; set; }
}
