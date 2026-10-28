using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Thông tin tóm tắt
/// </summary>
public class ApprovalSummary
{
    /// <summary>
    /// Thông tin dòng tóm tắt, dùng để định nghĩa nội dung hiển thị của một dòng tóm tắt
    /// </summary>
    [NotNull]
    [JsonProperty("summary_info")]
    [JsonPropertyName("summary_info")]
    public List<ApprovalSummaryInfo> SummaryInfo { get; set; } = default!;
    public ApprovalSummary()
    {

    }

    public ApprovalSummary(List<ApprovalSummaryInfo> summaryInfo)
    {
        SummaryInfo = summaryInfo;
    }
}
