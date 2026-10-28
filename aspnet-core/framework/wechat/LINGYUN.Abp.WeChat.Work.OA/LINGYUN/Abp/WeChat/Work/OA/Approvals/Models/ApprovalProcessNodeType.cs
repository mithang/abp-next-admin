using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Loại nút
/// </summary>
public enum ApprovalProcessNodeType : byte
{
    /// <summary>
    /// Người phê duyệt
    /// </summary>
    [Description("Người phê duyệt")]
    Approver = 1,
    /// <summary>
    /// Người nhận bản sao
    /// </summary>
    [Description("Người nhận bản sao")]
    CC = 2,
    /// <summary>
    /// Người xử lý
    /// </summary>
    [Description("Người xử lý")]
    Handler = 3,
}
