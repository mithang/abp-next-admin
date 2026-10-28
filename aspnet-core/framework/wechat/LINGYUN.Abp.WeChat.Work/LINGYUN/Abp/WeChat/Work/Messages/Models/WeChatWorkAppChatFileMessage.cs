using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn tệp trong nhóm trò chuyện của WeChat doanh nghiệp
/// </summary>
public class WeChatWorkAppChatFileMessage : WeChatWorkAppChatMessage
{
    public WeChatWorkAppChatFileMessage(
        string agentId,
        string chatId,
        MediaMessage file) : base(agentId, chatId, "file")
    {
        File = file;
    }
    /// <summary>
    /// Tệp phương tiện
    /// </summary>
    [NotNull]
    [JsonProperty("file")]
    [JsonPropertyName("file")]
    public MediaMessage File { get; set; }
    /// <summary>
    /// Cho biết có phải là tin nhắn bảo mật hay không,
    /// 0 nghĩa là có thể chia sẻ ra ngoài,
    /// 1 nghĩa là không thể chia sẻ và nội dung hiển thị watermark,
    /// Mặc định là 0
    /// </summary>
    [JsonProperty("safe")]
    [JsonPropertyName("safe")]
    public byte Safe { get; set; }
}
