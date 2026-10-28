using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Nút quy trình
/// </summary>
public class ApprovalProcessNode
{
    /// <summary>
    /// Loại nút: 1 - người phê duyệt, 2 - người nhận bản sao, 3 - người xử lý
    /// </summary>
    [NotNull]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public ApprovalProcessNodeType Type { get; set; }
    /// <summary>
    /// Trạng thái nút: 1 - đang phê duyệt; 2 - đồng ý; 3 - từ chối; 4 - chuyển xét duyệt; 11 - trả lại cho người phê duyệt được chỉ định; 12 - thêm người ký; 13 - đồng ý và thêm người ký; 14 - xử lý; 15 - chuyển giao
    /// </summary>
    [NotNull]
    [JsonProperty("sp_status")]
    [JsonPropertyName("sp_status")]
    public ApprovalProcessNodeStatus Status { get; set; }
    /// <summary>
    /// Phương thức phê duyệt nhiều người: 1 - hội ký; 2 - hoặc ký; 3 - phê duyệt lần lượt
    /// </summary>
    [CanBeNull]
    [JsonProperty("apv_rel")]
    [JsonPropertyName("apv_rel")]
    public byte? ApvRel { get; set; }
    /// <summary>
    /// Danh sách nút con
    /// </summary>
    [CanBeNull]
    [JsonProperty("sub_node_list")]
    [JsonPropertyName("sub_node_list")]
    public List<ApprovalProcessSubNode>? SubNodes { get; set; }
}
