using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn video trong nhóm trò chuyện WeChat Work
/// </summary>
public class WeChatWorkAppChatVideoMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatVideoMessage(
        string agentId,
        string chatId,
        VideoMessage video) : base(agentId, chatId, "video")
    {
        Video = video;
    }
    /// <summary>
    /// Tệp phương tiện video
    /// </summary>
    [NotNull]
    [JsonProperty("video")]
    [JsonPropertyName("video")]
    public VideoMessage Video { get; set; }
    /// <summary>
    /// Cho biết có phải là tin nhắn bảo mật hay không,
    /// 0 nghĩa là có thể chia sẻ ra ngoài,
    /// 1 nghĩa là không thể chia sẻ và nội dung hiển thị watermark,
    /// mặc định là 0
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public byte Safe { get; set; }
}
