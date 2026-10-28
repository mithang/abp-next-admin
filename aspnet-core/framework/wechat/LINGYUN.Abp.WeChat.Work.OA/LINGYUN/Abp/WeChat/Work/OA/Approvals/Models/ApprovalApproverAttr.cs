using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Phương thức phê duyệt của nút
/// </summary>
public enum ApprovalApproverAttr : byte
{
    /// <summary>
    /// Hoặc ký
    /// </summary>
    [Description("Hoặc ký")]
    OrSign = 1,
    /// <summary>
    /// Hội ký
    /// </summary>
    [Description("Hội ký")]
    CoSign = 2,
}
