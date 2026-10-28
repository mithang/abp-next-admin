using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Đối tượng chứa tin nhắn đồ họa-văn bản (mp)
/// </summary>
public class MpNewMessagePayload
{
    /// <summary>
    /// Danh sách tin nhắn đồ họa-văn bản (mp)
    /// </summary>
    [NotNull]
    [JsonProperty("articles")]
    [JsonPropertyName("articles")]
    public List<MpNewMessage> Articles { get; set; }

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public MpNewMessagePayload(List<MpNewMessage> articles)
    {
        Articles = articles;
    }
}
/// <summary>
/// Tin nhắn đồ họa-văn bản (mp)
/// </summary>
public class MpNewMessage
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public MpNewMessage(
        string title,
        string thumbMediaId,
        string content,
        string author = "",
        string contentSourceUrl = "",
        string description = "")
    {
        Title = title;
        ThumbMediaId = thumbMediaId;
        Author = author;
        ContentSourceUrl = contentSourceUrl;
        Content = content;
        Description = description;
    }

    /// <summary>
    /// Tiêu đề, không vượt quá 128 byte, vượt quá sẽ tự động cắt ngắn (hỗ trợ chuyển đổi id)
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = default!;
    /// <summary>
    /// media_id của ảnh thu nhỏ của tin nhắn đồ họa-văn bản, có thể lấy qua API quản lý tài nguyên. Tại đây thumb_media_id chính là media_id mà API tải lên trả về
    /// </summary>
    [NotNull]
    [JsonProperty("thumb_media_id")]
    [JsonPropertyName("thumb_media_id")]
    public string ThumbMediaId { get; set; } = default!;
    /// <summary>
    /// Tác giả của tin nhắn đồ họa-văn bản, không vượt quá 64 byte
    /// </summary>
    [CanBeNull]
    [JsonProperty("author")]
    [JsonPropertyName("author")]
    public string? Author { get; set; }
    /// <summary>
    /// Liên kết trang sau khi nhấp vào “Đọc toàn văn” của tin nhắn đồ họa-văn bản
    /// </summary>
    [CanBeNull]
    [JsonProperty("content_source_url")]
    [JsonPropertyName("content_source_url")]
    public string? ContentSourceUrl { get; set; }
    /// <summary>
    /// Nội dung của tin nhắn đồ họa-văn bản, hỗ trợ thẻ html, không vượt quá 666 K byte (hỗ trợ chuyển đổi id)
    /// </summary>
    [NotNull]
    [JsonProperty("content")]
    [JsonPropertyName("content")]
    public string Content { get; set; } = default!;
    /// <summary>
    /// Mô tả của tin nhắn đồ họa-văn bản, không vượt quá 512 byte, vượt quá sẽ tự động cắt ngắn (hỗ trợ chuyển đổi id)
    /// </summary>
    [CanBeNull]
    [JsonProperty("digest")]
    [JsonPropertyName("digest")]
    public string? Description { get; set; }
}
