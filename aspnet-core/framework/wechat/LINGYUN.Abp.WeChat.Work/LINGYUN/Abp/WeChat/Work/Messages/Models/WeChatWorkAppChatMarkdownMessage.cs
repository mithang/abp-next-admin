using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn markdown trong nhóm chat WeChat Work
/// </summary>
public class WeChatWorkAppChatMarkdownMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatMarkdownMessage(
        string agentId,
        string chatId,
        MarkdownMessage markdown) : base(agentId, chatId, "markdown")
    {
        Markdown = markdown;
    }
    /// <summary>
    /// Tin nhắn markdown
    /// </summary>
    [NotNull]
    [JsonProperty("markdown")]
    [JsonPropertyName("markdown")]
    public MarkdownMessage Markdown { get; set; }
    /// <summary>
    /// Cho biết có phải là tin nhắn bảo mật hay không,
    /// 0: không bảo mật
    /// 1: bảo mật
    /// Mặc định là 0
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public byte Safe { get; set; }
}
