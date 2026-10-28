using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tiêu đề cấp hai + văn bản
/// </summary>
public class TemplateCardHorizontalContent
{
    public static TemplateCardHorizontalContent None(string keyName, string value = "")
    {
        return new TemplateCardHorizontalContent(
            keyName, 0, value);
    }

    public static TemplateCardHorizontalContent FromUrl(string keyName, string url, string value = "")
    {
        return new TemplateCardHorizontalContent(
            keyName, 1, value, url);
    }

    public static TemplateCardHorizontalContent FromMedia(string keyName, string mediaId, string value = "")
    {
        return new TemplateCardHorizontalContent(
            keyName, 2, value, mediaId: mediaId);
    }

    public static TemplateCardHorizontalContent FromUser(string keyName, string userId, string value = "")
    {
        return new TemplateCardHorizontalContent(
            keyName, 3, value, userId: userId);
    }

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    public TemplateCardHorizontalContent(
        string keyName,
        byte type = 0, 
        string value = "", 
        string url = "", 
        string mediaId = "", 
        string userId = "")
    {
        Type = type;
        KeyName = keyName;
        Value = value;
        Url = url;
        MediaId = mediaId;
        UserId = userId;
    }

    /// <summary>
    /// Loại liên kết, 0 hoặc không điền nghĩa là không phải liên kết, 1 nghĩa là chuyển đến url, 2 nghĩa là tải xuống tệp đính kèm, 3 nghĩa là nhấp để chuyển đến chi tiết thành viên
    /// </summary>
    [CanBeNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public byte Type { get; }
    /// <summary>
    /// Tiêu đề cấp hai, nên không vượt quá 5 ký tự
    /// </summary>
    [NotNull]
    [JsonProperty("keyname")]
    [JsonPropertyName("keyname")]
    public string KeyName { get; set; } = default!;
    /// <summary>
    /// Văn bản cấp hai, nếu horizontal_content_list.type là 2, trường này đại diện cho tên tệp (phải bao gồm loại tệp), nên không vượt quá 30 ký tự, (hỗ trợ chuyển đổi id)
    /// </summary>
    [CanBeNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public string Value { get; set; }
    /// <summary>
    /// url chuyển đến liên kết, bắt buộc khi horizontal_content_list.type là 1
    /// </summary>
    [CanBeNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string Url { get; set; }
    /// <summary>
    /// media_id của tệp đính kèm, bắt buộc khi horizontal_content_list.type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public string MediaId { get; set; }
    /// <summary>
    /// userid của chi tiết thành viên, bắt buộc khi horizontal_content_list.type là 3
    /// </summary>
    [CanBeNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; }
}
