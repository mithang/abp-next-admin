using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Dữ liệu đơn xin phê duyệt
/// </summary>
public class ApprovalApplyData
{
    /// <summary>
    /// Chi tiết đơn xin phê duyệt, gồm nhiều điều khiển biểu mẫu và nội dung của chúng, trong đó chứa thông tin cần gán giá trị cho điều khiển
    /// </summary>
    [NotNull]
    [JsonProperty("contents")]
    [JsonPropertyName("contents")]
    public List<ControlData> Contents { get; set; } = default!;
    public ApprovalApplyData()
    {

    }

    public ApprovalApplyData(List<ControlData> contents)
    {
        Contents = contents;
    }
}
