using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn giọng nói của WeChat Work
/// </summary>
public class WeChatWorkVoiceMessage : WeChatWorkMessage
{
    public WeChatWorkVoiceMessage(
        string agentId,
        MediaMessage voice) : base(agentId, "voice")
    {
        Voice = voice;
    }
    /// <summary>
    /// Tệp media giọng nói
    /// </summary>
    [NotNull]
    [JsonProperty("voice")]
    [JsonPropertyName("voice")]
    public MediaMessage Voice { get; set; }
    /// <summary>
    /// Cho biết có bật kiểm tra tin nhắn trùng lặp hay không, 0 là không, 1 là có, mặc định là 0
    /// </summary>
    [JsonProperty("enable_duplicate_check")]
    [JsonPropertyName("enable_duplicate_check")]
    public byte EnableDuplicateCheck { get; set; }
    /// <summary>
    /// Khoảng thời gian kiểm tra tin nhắn trùng lặp, mặc định 1800 giây, tối đa không vượt quá 4 giờ
    /// </summary>
    [JsonProperty("duplicate_check_interval")]
    [JsonPropertyName("duplicate_check_interval")]
    public int DuplicateCheckInterval { get; set; } = 1800;
}
