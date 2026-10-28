using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Chat.Request;
public class WeChatWorkAppChatCreateRequest : WeChatWorkAppChatRequest
{
    public WeChatWorkAppChatCreateRequest(
        string agentId,
        string name,
        List<string> users,
        string? owner = null,
        string? chatId = null)
        : base(agentId)
    {
        Name = name;
        Owner = owner;
        Users = users;
        ChatId = chatId;
    }

    /// <summary>
    /// Tên nhóm trò chuyện, tối đa 50 ký tự utf8, vượt quá sẽ bị cắt ngắn
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public virtual string Name { get; set; }
    /// <summary>
    /// Id của chủ nhóm được chỉ định.
    /// Nếu không chỉ định, hệ thống sẽ chọn ngẫu nhiên một người từ userlist làm chủ nhóm
    /// </summary>
    [CanBeNull]
    [JsonProperty("owner")]
    [JsonPropertyName("owner")]
    public virtual string? Owner { get; set; }
    /// <summary>
    /// Danh sách id thành viên nhóm.
    /// Ít nhất 2 người, tối đa 2000 người
    /// </summary>
    [NotNull]
    [JsonProperty("userlist")]
    [JsonPropertyName("userlist")]
    public virtual List<string> Users { get; set; }
    /// <summary>
    /// Dấu hiệu duy nhất của nhóm trò chuyện, không được trùng với nhóm đã có;
    /// Kiểu chuỗi, tối đa 32 ký tự.
    /// Chỉ cho phép ký tự 0-9 và chữ cái a-zA-Z.
    /// Nếu không điền, hệ thống sẽ tự động tạo ngẫu nhiên id nhóm
    /// </summary>
    [CanBeNull]
    [JsonProperty("chatid")]
    [JsonPropertyName("chatid")]
    public virtual string? ChatId { get; set; }
}
