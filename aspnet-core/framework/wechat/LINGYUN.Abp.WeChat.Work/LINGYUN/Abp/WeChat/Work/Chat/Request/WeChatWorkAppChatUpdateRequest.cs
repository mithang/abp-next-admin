using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Chat.Request;
public class WeChatWorkAppChatUpdateRequest : WeChatWorkAppChatRequest
{
    public WeChatWorkAppChatUpdateRequest(
        string agentId,
        string chatId,
        string? name = null,
        string? owner = null,
        List<string>? addUsers = null,
        List<string>? delUsers = null)
        : base(agentId)
    {
        Name = name;
        Owner = owner;
        AddUsers = addUsers;
        DelUsers = delUsers;
        ChatId = chatId;
    }

    /// <summary>
    /// Tên nhóm trò chuyện mới. Nếu không cần cập nhật, hãy bỏ qua tham số này. Tối đa 50 ký tự utf8, vượt quá sẽ bị cắt ngắn
    /// </summary>
    [CanBeNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public virtual string? Name { get; set; }
    /// <summary>
    /// id của chủ nhóm mới.
    /// Nếu không cần cập nhật, hãy bỏ qua tham số này. Chủ nhóm trò chuyện của khóa học phải nằm trong danh sách chủ nhóm đã thiết lập
    /// </summary>
    [CanBeNull]
    [JsonProperty("owner")]
    [JsonPropertyName("owner")]
    public virtual string? Owner { get; set; }
    /// <summary>
    /// Danh sách id của thành viên được thêm vào
    /// </summary>
    [CanBeNull]
    [JsonProperty("add_user_list")]
    [JsonPropertyName("add_user_list")]
    public virtual List<string>? AddUsers { get; set; }
    /// <summary>
    /// Danh sách id của thành viên bị xóa khỏi nhóm
    /// </summary>
    [CanBeNull]
    [JsonProperty("del_user_list")]
    [JsonPropertyName("del_user_list")]
    public virtual List<string>? DelUsers { get; set; }
    /// <summary>
    /// id nhóm trò chuyện
    /// </summary>
    [NotNull]
    [JsonProperty("chatid")]
    [JsonPropertyName("chatid")]
    public virtual string ChatId { get; set; }
}
