using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Thông tin ghi chú của đơn xin phê duyệt
/// </summary>
public class ApprovalComment
{
    /// <summary>
    /// Thông tin người ghi chú
    /// </summary>
    [CanBeNull]
    [JsonProperty("commentUserInfo")]
    [JsonPropertyName("commentUserInfo")]
    public ApprovalUser? CommentUserInfo { get; set; }
    /// <summary>
    /// Thời gian nộp đơn xin phê duyệt, dấu thời gian Unix
    /// </summary>
    [NotNull]
    [JsonProperty("commenttime")]
    [JsonPropertyName("commenttime")]
    public long CommentTime { get; set; }
    /// <summary>
    /// Nội dung văn bản ghi chú
    /// </summary>
    [NotNull]
    [JsonProperty("commentcontent")]
    [JsonPropertyName("commentcontent")]
    public string CommentContent { get; set; } = default!;
    /// <summary>
    /// Id ghi chú
    /// </summary>
    [NotNull]
    [JsonProperty("commentid")]
    [JsonPropertyName("commentid")]
    public string CommentId { get; set; } = default!;
    /// <summary>
    /// Id tệp đính kèm của ghi chú, có thể có nhiều; tệp trên WeDrive không lấy được
    /// </summary>
    [CanBeNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public List<string>? MediaId { get; set; }
}
