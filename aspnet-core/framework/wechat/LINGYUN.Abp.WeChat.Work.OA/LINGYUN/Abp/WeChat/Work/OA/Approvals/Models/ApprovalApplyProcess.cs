using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Quy trình xin phê duyệt
/// </summary>
public class ApprovalApplyProcess
{
    /// <summary>
    /// Danh sách nút quy trình
    /// </summary>
    [NotNull]
    [JsonProperty("node_list")]
    [JsonPropertyName("node_list")]
    public List<ApprovalApplyProcessNode> Nodes { get; set; } = default!;
    public ApprovalApplyProcess()
    {

    }

    public ApprovalApplyProcess(List<ApprovalApplyProcessNode> nodes)
    {
        Nodes = nodes;
    }
}
