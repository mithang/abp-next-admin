using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn văn bản - hình ảnh (mp) trong nhóm trò chuyện của WeChat doanh nghiệp
/// </summary>
public class WeChatWorkAppChatMpNewMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatMpNewMessage(
        string agentId,
        string chatId,
        MpNewMessagePayload mpnews) : base(agentId, chatId, "mpnews")
    {
        News = mpnews;
    }
    /// <summary>
    /// Tin nhắn văn bản - hình ảnh (mp)
    /// </summary>
    [NotNull]
    [JsonProperty("mpnews")]
    [JsonPropertyName("mpnews")]
    public MpNewMessagePayload News { get; set; }
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
