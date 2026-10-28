using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển phiếu phê duyệt liên kết
/// </summary>
public class RelatedApprovalControlValue : ControlValue
{
    /// <summary>
    /// Phiếu phê duyệt liên kết
    /// </summary>
    [NotNull]
    [JsonProperty("related_approval")]
    [JsonPropertyName("related_approval")]
    public RelatedApprovalValue RelatedApproval { get; set; } = default!;
    public RelatedApprovalControlValue()
    {

    }

    public RelatedApprovalControlValue(RelatedApprovalValue relatedApproval)
    {
        RelatedApproval = relatedApproval;
    }
}


public class RelatedApprovalValue
{
    /// <summary>
    /// Số phiếu phê duyệt của phiếu phê duyệt liên kết
    /// </summary>
    [NotNull]
    [JsonProperty("sp_no")]
    [JsonPropertyName("sp_no")]
    public string SpNo { get; set; } = default!;
    public RelatedApprovalValue()
    {

    }

    public RelatedApprovalValue(string spNo)
    {
        SpNo = spNo;
    }
}