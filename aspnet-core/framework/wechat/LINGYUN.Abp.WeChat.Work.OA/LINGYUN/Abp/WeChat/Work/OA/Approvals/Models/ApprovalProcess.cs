using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Quy trình
/// </summary>
public class ApprovalProcess
{
    /// <summary>
    /// Nút quy trình
    /// </summary>
    [NotNull]
    [JsonProperty("node_list")]
    [JsonPropertyName("node_list")]
    public List<ApprovalProcessNode> Nodes { get; set; } = default!;
}
