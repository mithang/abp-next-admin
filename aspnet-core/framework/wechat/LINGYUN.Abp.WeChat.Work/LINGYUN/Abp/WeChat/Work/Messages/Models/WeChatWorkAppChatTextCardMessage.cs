using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn thẻ văn bản trong nhóm chat WeChat Work
/// </summary>
public class WeChatWorkAppChatTextCardMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatTextCardMessage(
        string agentId,
        string chatId,
        TextCardMessage textcard) : base(agentId, chatId, "textcard")
    {
        TextCard = textcard;
    }
    /// <summary>
    /// Tin nhắn thẻ
    /// </summary>
    [NotNull]
    [JsonProperty("textcard")]
    [JsonPropertyName("textcard")]
    public TextCardMessage TextCard { get; set; }
    /// <summary>
    /// Cho biết có phải là tin nhắn bảo mật hay không,
    /// 0 nghĩa là có thể chia sẻ ra ngoài,
    /// 1 nghĩa là không thể chia sẻ và nội dung hiển thị hình mờ,
    /// Mặc định là 0
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public byte Safe { get; set; }
}
