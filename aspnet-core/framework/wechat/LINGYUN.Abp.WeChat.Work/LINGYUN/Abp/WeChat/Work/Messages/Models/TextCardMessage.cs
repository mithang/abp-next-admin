using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tin nhắn thẻ văn bản
/// </summary>
public class TextCardMessage
{
    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TextCardMessage(
        string title,
        string description,
        string url,
        string buttonText = "")
    {
        Title = title;
        Description = description;
        Url = url;
        ButtonText = buttonText;
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
    [NotNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string Description { get; set; }
    /// <summary>
    /// Liên kết chuyển hướng sau khi nhấn. Tối đa 2048 byte, hãy đảm bảo đã bao gồm tiêu đề giao thức (http/https)
    /// </summary>
    [NotNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string Url { get; set; }
    /// <summary>
    /// Văn bản nút. Mặc định là "Chi tiết", không quá 4 ký tự, vượt quá sẽ tự động cắt ngắn.
    /// </summary>
    [CanBeNull]
    [JsonProperty("btntxt")]
    [JsonPropertyName("btntxt")]
    public string ButtonText { get; set; }
}
