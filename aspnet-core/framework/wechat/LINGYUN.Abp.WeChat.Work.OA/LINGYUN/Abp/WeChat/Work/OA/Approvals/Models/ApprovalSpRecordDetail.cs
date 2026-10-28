using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Chi tiết nút phê duyệt
/// </summary>
public class ApprovalSpRecordDetail
{
    /// <summary>
    /// Người phê duyệt nhánh
    /// </summary>
    [NotNull]
    [JsonProperty("approver")]
    [JsonPropertyName("approver")]
    public ApprovalUser Approver { get; set; } = default!;
    /// <summary>
    /// Ý kiến phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("speech")]
    [JsonPropertyName("speech")]
    public string Speech { get; set; } = default!;
    /// <summary>
    /// Trạng thái phê duyệt của người phê duyệt nhánh
    /// </summary>
    [NotNull]
    [JsonProperty("sp_status")]
    [JsonPropertyName("sp_status")]
    public ApprovalSpRecordStatus SpStatus { get; set; }
    /// <summary>
    /// Dấu thời gian thao tác phê duyệt của người phê duyệt nhánh tại nút, 0 nghĩa là chưa thao tác
    /// </summary>
    [NotNull]
    [JsonProperty("sptime")]
    [JsonPropertyName("sptime")]
    public long SpTime { get; set; }
    /// <summary>
    /// Tệp đính kèm ý kiến phê duyệt của người phê duyệt nhánh tại nút, tệp trên WeDrive không thể lấy được
    /// </summary>
    [CanBeNull]
    [JsonProperty("media_id")]
    [JsonPropertyName("media_id")]
    public List<string>? MediaId { get; set; }
}
