using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Attachments.Response;
/// <summary>
/// Kết quả phản hồi tải lên tài nguyên tệp đính kèm
/// </summary>
/// <remarks>
/// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/95098" />
/// </remarks>
public class WeChatWorkUploadAttachmentResponse : WeChatWorkResponse
{
    /// <summary>
    /// Loại tệp phương tiện, gồm hình ảnh (image), âm thanh (voice), video (video), tệp thông thường (file)
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string MediaType { get; set; } = default!;
    /// <summary>
    /// Định danh duy nhất thu được sau khi tải lên tệp phương tiện, có hiệu lực trong ba ngày, có thể lấy qua giao diện lấy tài liệu tạm thời
    /// </summary>
    [NotNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public string MediaId { get; set; } = default!;
    /// <summary>
    /// Dấu thời gian tải lên tệp phương tiện
    /// </summary>
    [NotNull]
    [JsonProperty("created_at")]
    [JsonPropertyName("created_at")]
    public long CreatedAt { get; set; }
}
