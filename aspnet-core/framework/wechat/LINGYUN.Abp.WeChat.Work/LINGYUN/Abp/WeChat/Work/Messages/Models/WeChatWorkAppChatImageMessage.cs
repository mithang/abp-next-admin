using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn hình ảnh trong nhóm trò chuyện WeChat Work
/// </summary>
public class WeChatWorkAppChatImageMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatImageMessage(
        string agentId,
        string chatId,
        MediaMessage image) : base(agentId, chatId, "image")
    {
        Image = image;
    }
    /// <summary>
    /// Tệp phương tiện hình ảnh
    /// </summary>
    [NotNull]
    [JsonProperty("image")]
    [JsonPropertyName("image")]
    public MediaMessage Image { get; set; }
    /// <summary>
    /// Cho biết có phải là tin nhắn bảo mật hay không,
    /// 0 nghĩa là có thể chia sẻ ra ngoài,
    /// 1 nghĩa là không thể chia sẻ và nội dung hiển thị watermark,
    /// mặc định là 0
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public int Safe { get; set; }
}
