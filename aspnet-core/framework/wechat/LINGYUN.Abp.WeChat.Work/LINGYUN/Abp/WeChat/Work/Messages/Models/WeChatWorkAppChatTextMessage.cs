using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn văn bản trong nhóm trò chuyện của WeChat doanh nghiệp
/// </summary>
public class WeChatWorkAppChatTextMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatTextMessage(
        string agentId,
        string chatId,
        TextMessage text) : base(agentId, chatId, "text")
    {
        Text = text;
    }

    /// <summary>
    /// Nội dung tin nhắn, tối đa 2048 byte, vượt quá sẽ bị cắt ngắn (hỗ trợ chuyển đổi id)
    /// </summary>
    [NotNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public TextMessage Text { get; set; }
    /// <summary>
    /// Cho biết có phải là tin nhắn bảo mật hay không,
    /// 0 nghĩa là có thể chia sẻ ra ngoài,
    /// 1 nghĩa là không thể chia sẻ và nội dung hiển thị watermark,
    /// Mặc định là 0
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public int Safe { get; set; }
}
