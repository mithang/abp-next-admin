using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình điều khiển đơn phê duyệt liên kết
/// </summary>
public class RelatedApprovalControlConfig : ControlConfig
{
    /// <summary>
    /// Điều khiển đơn phê duyệt liên kết
    /// </summary>
    [NotNull]
    [JsonProperty("related_approval")]
    [JsonPropertyName("related_approval")]
    public RelatedApprovalConfig RelatedApproval { get; set; } = default!;
    public RelatedApprovalControlConfig()
    {

    }

    public RelatedApprovalControlConfig(RelatedApprovalConfig relatedApproval)
    {
        RelatedApproval = relatedApproval;
    }
}

public class RelatedApprovalConfig
{
    /// <summary>
    /// Template_id của đơn phê duyệt liên kết; khi không điền nghĩa là có thể liên kết tất cả mẫu, template_id này có thể lấy qua giao diện lấy mẫu phê duyệt
    /// </summary>
    [NotNull]
    [JsonProperty("template_id")]
    [JsonPropertyName("template_id")]
    public string TemplateId { get; set; } = default!;
    public RelatedApprovalConfig()
    {

    }

    public RelatedApprovalConfig(string templateId)
    {
        TemplateId = templateId;
    }
}
