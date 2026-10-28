using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Nút con
/// </summary>
public class ApprovalProcessSubNode
{
    /// <summary>
    /// Thông tin người xử lý
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Ý kiến phê duyệt/xử lý
    /// </summary>
    [NotNull]
    [JsonProperty("speech")]
    [JsonPropertyName("speech")]
    public string Speech { get; set; } = default!;
    /// <summary>
    /// Trạng thái nút con: 1 - đang phê duyệt; 2 - đồng ý; 3 - từ chối; 4 - chuyển xét duyệt; 11 - trả lại cho người phê duyệt được chỉ định; 12 - thêm người ký; 13 - đồng ý và thêm người ký; 14 - xử lý; 15 - chuyển giao
    /// </summary>
    [NotNull]
    [JsonProperty("sp_yj")]
    [JsonPropertyName("sp_yj")]
    public ApprovalProcessNodeStatus Status { get; set; }
    /// <summary>
    /// Thời gian thao tác
    /// </summary>
    [NotNull]
    [JsonProperty("sptime")]
    [JsonPropertyName("sptime")]
    public long SpTime { get; set; }
    /// <summary>
    /// Tệp đính kèm, không thể lấy được tệp trên WeDrive
    /// </summary>
    [CanBeNull]
    [JsonProperty("media_ids")]
    [JsonPropertyName("media_ids")]
    public List<string>? MediaIds { get; set; }
}
