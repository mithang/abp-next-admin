using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;
/// <summary>
/// Tiêu đề cấp hai + văn bản
/// </summary>
public class WebhookTemplateCardHorizontalContent
{
    /// <summary>
    /// Các loại nội dung thông tin tiêu đề cấp hai của thẻ mẫu được hỗ trợ: 1 là url, 2 là tệp đính kèm, 3 nghĩa là nhấn để chuyển đến chi tiết thành viên
    /// </summary>
    [CanBeNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public int? Type { get; set; }
    /// <summary>
    /// Tiêu đề cấp hai, nên không quá 5 ký tự
    /// </summary>
    [NotNull]
    [JsonProperty("keyname")]
    [JsonPropertyName("keyname")]
    public string KeyName { get; set; }
    /// <summary>
    /// Văn bản cấp hai, nếu type là 2 thì trường này đại diện cho tên tệp (phải bao gồm loại tệp), nên không quá 26 ký tự
    /// </summary>
    [CanBeNull]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public string? Value { get; set; }
    /// <summary>
    /// URL chuyển hướng liên kết, bắt buộc khi type là 1
    /// </summary>
    [CanBeNull]
    [JsonProperty("url")]
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    /// <summary>
    /// media_id của tệp đính kèm, bắt buộc khi type là 2
    /// </summary>
    [CanBeNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public string? MediaId { get; set; }
    /// <summary>
    /// userid của chi tiết thành viên, bắt buộc khi type là 3
    /// </summary>
    [CanBeNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string? UserId { get; set; }
    [System.Text.Json.Serialization.JsonConstructor]
    public WebhookTemplateCardHorizontalContent(
        string keyName,
        int? type = null,
        string? value = null,
        string? url = null,
        string? mediaId = null,
        string? userId = null)
    {
        Type = type;
        KeyName = keyName;
        Value = value;
        Url = url;
        MediaId = mediaId;
        UserId = userId;
    }
    /// <summary>
    /// Tạo một tiêu đề cấp hai + văn bản mặc định
    /// </summary>
    /// <param name="keyName">Tiêu đề cấp hai</param>
    /// <param name="value">Văn bản cấp hai</param>
    /// <returns></returns>
    public static WebhookTemplateCardHorizontalContent Default(string keyName, string? value = null)
    {
        Check.NotNullOrWhiteSpace(keyName, nameof(keyName));

        return new WebhookTemplateCardHorizontalContent(keyName, value: value);
    }
    /// <summary>
    /// Tạo một tiêu đề cấp hai + văn bản chuyển hướng liên kết
    /// </summary>
    /// <param name="keyName">Tiêu đề cấp hai</param>
    /// <param name="url">URL chuyển hướng liên kết</param>
    /// <param name="value">Văn bản cấp hai</param>
    /// <returns></returns>
    public static WebhookTemplateCardHorizontalContent Link(string keyName, string url, string? value = null)
    {
        Check.NotNullOrWhiteSpace(keyName, nameof(keyName));
        Check.NotNullOrWhiteSpace(url, nameof(url));

        return new WebhookTemplateCardHorizontalContent(keyName, 1, value: value, url: url);
    }
    /// <summary>
    /// Tạo một tiêu đề cấp hai + văn bản tham chiếu tệp
    /// </summary>
    /// <param name="keyName">Tiêu đề cấp hai</param>
    /// <param name="fileName">Tên tệp</param>
    /// <param name="mediaId">mediaId của tệp đính kèm</param>
    /// <returns></returns>
    public static WebhookTemplateCardHorizontalContent File(string keyName, string fileName, string mediaId)
    {
        Check.NotNullOrWhiteSpace(keyName, nameof(keyName));
        Check.NotNullOrWhiteSpace(fileName, nameof(fileName));
        Check.NotNullOrWhiteSpace(mediaId, nameof(mediaId));

        return new WebhookTemplateCardHorizontalContent(keyName, 2, value: fileName, mediaId: mediaId);
    }
    /// <summary>
    /// Tạo một tiêu đề cấp hai + văn bản chi tiết thành viên
    /// </summary>
    /// <param name="keyName">Tiêu đề cấp hai</param>
    /// <param name="userId">userid của thành viên</param>
    /// <returns></returns>
    public static WebhookTemplateCardHorizontalContent UserInfo(string keyName, string userId)
    {
        Check.NotNullOrWhiteSpace(keyName, nameof(keyName));
        Check.NotNullOrWhiteSpace(userId, nameof(userId));

        return new WebhookTemplateCardHorizontalContent(keyName, 3, userId: userId);
    }
}
