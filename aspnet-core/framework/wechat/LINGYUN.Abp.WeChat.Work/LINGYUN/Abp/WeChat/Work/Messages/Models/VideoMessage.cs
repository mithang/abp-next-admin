using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn video
/// </summary>
public class VideoMessage
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public VideoMessage(
        string mediaId,
        string title = "",
        string description = "")
    {
        Title = title;
        Description = description;
        MediaId = mediaId;
    }

    /// <summary>
    /// Tiêu đề của tin nhắn video, không vượt quá 128 byte, vượt quá sẽ tự động bị cắt ngắn
    /// </summary>
    [CanBeNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    /// <summary>
    /// Mô tả của tin nhắn video, không vượt quá 512 byte, vượt quá sẽ tự động bị cắt ngắn
    /// </summary>
    [CanBeNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    /// <summary>
    /// Id tệp media video, có thể thu được bằng cách gọi API tải lên tài liệu tạm thời
    /// </summary>
    [NotNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public string MediaId { get; set; }
}
