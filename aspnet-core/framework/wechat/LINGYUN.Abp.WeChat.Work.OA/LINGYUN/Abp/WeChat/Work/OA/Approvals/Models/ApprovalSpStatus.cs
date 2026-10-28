using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Trạng thái đơn xin phê duyệt
/// </summary>
public enum ApprovalSpStatus : byte
{
    /// <summary>
    /// Đang phê duyệt
    /// </summary>
    [Description("Đang phê duyệt")]
    UnderApproval = 1,
    /// <summary>
    /// Đã phê duyệt
    /// </summary>
    [Description("Đã phê duyệt")]
    Passed = 2,
    /// <summary>
    /// Đã từ chối
    /// </summary>
    [Description("Đã từ chối")]
    Rejected = 3,
    /// <summary>
    /// Đã thu hồi
    /// </summary>
    [Description("Đã thu hồi")]
    Revoked = 4,
    /// <summary>
    /// Thu hồi sau khi phê duyệt
    /// </summary>
    [Description("Thu hồi sau khi phê duyệt")]
    RevokeAfterApproval = 6,
    /// <summary>
    /// Đã xóa
    /// </summary>
    [Description("Đã xóa")]
    Deleted = 7,
    /// <summary>
    /// Đã thanh toán
    /// </summary>
    [Description("Đã thanh toán")]
    Paid = 10,
}
