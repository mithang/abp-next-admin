using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn văn bản kèm hình ảnh trong nhóm trò chuyện WeChat Work
/// </summary>
public class WeChatWorkAppChatNewMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatNewMessage(
        string agentId,
        string chatId,
        NewMessagePayload news) : base(agentId, chatId, "news")
    {
        News = news;
    }
    /// <summary>
    /// Tin nhắn hình ảnh-văn bản
    /// </summary>
    [NotNull]
    [JsonProperty("news")]
    [JsonPropertyName("news")]
    public NewMessagePayload News { get; set; }
    /// <summary>
    /// Cho biết có phải là tin nhắn bảo mật hay không,
    /// 0 là không bảo mật
    /// 1 là bảo mật
    /// mặc định là 0
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public byte Safe { get; set; }
}
