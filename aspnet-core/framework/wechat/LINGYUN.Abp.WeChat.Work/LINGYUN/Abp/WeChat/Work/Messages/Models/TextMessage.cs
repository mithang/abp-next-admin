using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn văn bản
/// </summary>
public class TextMessage
{
    public TextMessage(string content)
    {
        Content = Check.NotNullOrWhiteSpace(content, nameof(content), 2048);
    }

    /// <summary>
    /// Nội dung tin nhắn, dài tối đa 2048 byte, vượt quá sẽ bị cắt ngắn (hỗ trợ chuyển đổi id)
    /// </summary>
    [NotNull]
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public string Content { get; set; }
}
