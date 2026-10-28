using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn markdown của WeChat Work
/// </summary>
public class WeChatWorkMarkdownMessage : WeChatWorkMessage
{
    public WeChatWorkMarkdownMessage(
        string agentId,
        MarkdownMessage markdown) : base(agentId, "markdown")
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
