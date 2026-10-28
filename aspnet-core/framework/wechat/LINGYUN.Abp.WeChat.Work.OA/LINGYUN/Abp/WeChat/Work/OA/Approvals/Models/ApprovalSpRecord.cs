using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Thông tin quy trình phê duyệt
/// </summary>
public class ApprovalSpRecord
{
    /// <summary>
    /// Trạng thái nút phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("sp_status")]
    [JsonPropertyName("sp_status")]
    public ApprovalSpRecordStatus SpStatus { get; set; }
    /// <summary>
    /// Phương thức phê duyệt của nút
    /// </summary>
    [NotNull]
    [JsonProperty("approverattr")]
    [JsonPropertyName("approverattr")]
    public ApprovalApproverAttr ApproverAttr { get; set; }
    /// <summary>
    /// Chi tiết nút phê duyệt, một nút phê duyệt có nhiều người phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("details")]
    [JsonPropertyName("details")]
    public List<ApprovalSpRecordDetail> Details { get; set; } = default!;
}
