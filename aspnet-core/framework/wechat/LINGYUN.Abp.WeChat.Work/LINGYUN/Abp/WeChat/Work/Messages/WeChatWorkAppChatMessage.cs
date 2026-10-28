using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages;
/// <summary>
/// Tin nhắn trò chuyện nhóm WeChat doanh nghiệp
/// </summary>
public abstract class WeChatWorkAppChatMessage : WeChatWorkRequest
{
    protected WeChatWorkAppChatMessage(
        string agentId,
        string chatId,
        string msgType)
    {
        AgentId = agentId;
        ChatId = chatId;
        MsgType = msgType;
    }

    /// <summary>
    /// Id trò chuyện nhóm
    /// </summary>
    [NotNull]
    [JsonProperty("chatid")]
    [JsonPropertyName("chatid")]
    public virtual string ChatId { get; protected set; }
    /// <summary>
    /// Loại tin nhắn
    /// </summary>
    [NotNull]
    [JsonProperty("msgtype")]
    [JsonPropertyName("msgtype")]
    public virtual string MsgType { get; protected set; }
    /// <summary>
    /// Id ứng dụng doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Vì cần đổi lấy token, do đó cần truyền định danh ứng dụng
    /// </remarks>
    [NotNull]
    [Newtonsoft.Json.JsonIgnore]
    [System.Text.Json.Serialization.JsonIgnore]
    public virtual string AgentId { get; protected set; }
}
