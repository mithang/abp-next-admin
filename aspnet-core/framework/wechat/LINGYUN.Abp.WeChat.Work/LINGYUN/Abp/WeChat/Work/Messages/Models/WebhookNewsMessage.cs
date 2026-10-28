using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Thân tin nhắn đồ họa-văn bản Webhook
/// </summary>
public class WebhookNewsMessage
{
    /// <summary>
    /// Tin nhắn đồ họa-văn bản, một tin nhắn đồ họa-văn bản hỗ trợ 1 đến 8 tin nhắn đồ họa-văn bản
    /// </summary>
    [NotNull]
    [JsonProperty("articles")]
    [JsonPropertyName("articles")]
    public List<WebhookArticleMessage> Articles { get; set; }
    /// <summary>
    /// Tạo một thân tin nhắn đồ họa-văn bản Webhook
    /// </summary>
    /// <param name="articles">Danh sách tin nhắn đồ họa-văn bản</param>
    /// <exception cref="ArgumentException"></exception>
    public WebhookNewsMessage(List<WebhookArticleMessage> articles)
    {
        Articles = Check.NotNull(articles, nameof(articles));

        if (Articles.Count < 1 || Articles.Count > 8)
        {
            throw new ArgumentException("One image-text message supports 1 to 8 image-text messages!");
        }
    }
}

public class WebhookArticleMessage
{
    /// <summary>
    /// Tiêu đề, không quá 128 byte, vượt quá sẽ tự động bị cắt ngắn
    /// </summary>
    [NotNull]
    [StringLength(128)]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; }
    /// <summary>
    /// Mô tả, không quá 512 byte, vượt quá sẽ tự động bị cắt ngắn
    /// </summary>
    [CanBeNull]
    [StringLength(512)]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    /// <summary>
    /// Liên kết sẽ chuyển đến sau khi nhấp.
    /// </summary>
    [NotNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string Url { get; set; }
    /// <summary>
    /// Liên kết hình ảnh của tin nhắn đồ họa-văn bản, hỗ trợ định dạng JPG, PNG, hiệu quả tốt hơn với ảnh lớn 1068*455, ảnh nhỏ 150*150.
    /// </summary>
    [CanBeNull]
    [JsonProperty("picurl")]
    [JsonPropertyName("picurl")]
    public string? PictureUrl { get; set; }
    /// <summary>
    /// Tạo một tin nhắn đồ họa-văn bản
    /// </summary>
    /// <param name="title">Tiêu đề</param>
    /// <param name="url">Liên kết sẽ chuyển đến sau khi nhấp</param>
    /// <param name="description">Mô tả</param>
    /// <param name="pictureUrl">Liên kết hình ảnh của tin nhắn đồ họa-văn bản</param>
    public WebhookArticleMessage(
        string title,
        string url,
        string description = "",
        string pictureUrl = "")
    {
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), 128);
        Url = Check.NotNullOrWhiteSpace(url, nameof(url));
        Description = Check.Length(description, nameof(description), 512);
        PictureUrl = pictureUrl;
    }
}
