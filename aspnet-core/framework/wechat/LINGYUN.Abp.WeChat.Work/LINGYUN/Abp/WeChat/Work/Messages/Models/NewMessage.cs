using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Đối tượng chứa tin nhắn đồ họa-văn bản
/// </summary>
public class NewMessagePayload
{
    /// <summary>
    /// Danh sách tin nhắn đồ họa-văn bản
    /// </summary>
    [NotNull]
    [JsonProperty("articles")]
    [JsonPropertyName("articles")]
    public List<NewMessage> Articles { get; set; }
    public NewMessagePayload(List<NewMessage> articles)
    {
        Articles = articles;
    }
}
/// <summary>
/// Tin nhắn đồ họa-văn bản
/// </summary>
public class NewMessage
{
    public NewMessage(
        string title,
        string description = "",
        string url = "",
        string pictureUrl = "",
        string appId = "",
        string pagePath = "")
    {
        Title = title;
        Description = description;
        Url = url;
        PictureUrl = pictureUrl;
        AppId = appId;
        PagePath = pagePath;
    }

    /// <summary>
    /// Tiêu đề, không quá 128 byte, vượt quá sẽ tự động cắt ngắn (hỗ trợ chuyển đổi id)
    /// </summary>
    [NotNull]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; }
    /// <summary>
    /// Mô tả, không quá 512 byte, vượt quá sẽ tự động cắt ngắn (hỗ trợ chuyển đổi id)
    /// </summary>
    [CanBeNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string Description { get; set; }
    /// <summary>
    /// Liên kết chuyển đến sau khi nhấp vào.
    /// Dài nhất 2048 byte, hãy đảm bảo đã bao gồm tiêu đề giao thức (http/https), chương trình mini hoặc url phải điền một trong hai
    /// </summary>
    [CanBeNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string Url { get; set; }
    /// <summary>
    /// Liên kết hình ảnh của tin nhắn đồ họa-văn bản, dài nhất 2048 byte, hỗ trợ định dạng JPG, PNG, hiệu quả tốt hơn với ảnh lớn 1068*455, ảnh nhỏ 150*150.
    /// </summary>
    [CanBeNull]
    [JsonProperty("picurl")]
    [JsonPropertyName("picurl")]
    public string PictureUrl { get; set; }
    /// <summary>
    /// Appid của chương trình mini, phải là chương trình mini liên kết với ứng dụng hiện tại, appid và pagepath phải điền đồng thời, sau khi điền sẽ bỏ qua trường url
    /// </summary>
    [CanBeNull]
    [JsonProperty("appid")]
    [JsonPropertyName("appid")]
    public string AppId { get; set; }
    /// <summary>
    /// Trang chương trình mini sau khi nhấp vào thẻ tin nhắn, dài nhất 128 byte, chỉ giới hạn trong các trang của chương trình mini này. appid và pagepath phải điền đồng thời, sau khi điền sẽ bỏ qua trường url
    /// </summary>
    [CanBeNull]
    [JsonProperty("pagepath")]
    [JsonPropertyName("pagepath")]
    public string PagePath { get; set; }
}
