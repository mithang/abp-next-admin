using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Chat.Models;
public class WeChatWorkAppChatInfo
{
    /// <summary>
    /// Tên nhóm chat
    /// </summary>
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public virtual string Name { get; set; } = default!;
    /// <summary>
    /// Id chủ nhóm
    /// </summary>
    [JsonProperty("owner")]
    [JsonPropertyName("owner")]
    public virtual string Owner { get; set; } = default!;
    /// <summary>
    /// Danh sách id thành viên nhóm
    /// </summary>
    [JsonProperty("userlist")]
    [JsonPropertyName("userlist")]
    public virtual List<string> Users { get; set; } = default!;
    /// <summary>
    /// Cờ duy nhất của nhóm chat
    /// </summary>
    [JsonProperty("chatid")]
    [JsonPropertyName("chatid")]
    public virtual string ChatId { get; set; } = default!;
}
