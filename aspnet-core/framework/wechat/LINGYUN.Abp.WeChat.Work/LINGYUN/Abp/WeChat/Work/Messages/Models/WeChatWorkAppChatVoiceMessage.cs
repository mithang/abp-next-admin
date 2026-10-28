using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn thoại trong nhóm chat WeChat Work
/// </summary>
public class WeChatWorkAppChatVoiceMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatVoiceMessage(
        string agentId,
        string chatId,
        MediaMessage voice) : base(agentId, chatId, "voice")
    {
        Voice = voice;
    }
    /// <summary>
    /// Tệp phương tiện thoại
    /// </summary>
    [NotNull]
    [JsonProperty("voice")]
    [JsonPropertyName("voice")]
    public MediaMessage Voice { get; set; }
}
