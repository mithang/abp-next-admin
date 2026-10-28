using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Trạng thái nút
/// </summary>
public enum ApprovalProcessNodeStatus : byte
{
    /// <summary>
    /// Đang phê duyệt
    /// </summary>
    [Description("Đang phê duyệt")]
    UnderApproval = 1,
    /// <summary>
    /// Đồng ý
    /// </summary>
    [Description("Đồng ý")]
    Agree = 2,
    /// <summary>
    /// Từ chối
    /// </summary>
    [Description("Từ chối")]
    Rejection = 3,
    /// <summary>
    /// Chuyển xét duyệt
    /// </summary>
    [Description("Chuyển xét duyệt")]
    TransferForReview = 4,
    /// <summary>
    /// Trả lại cho người phê duyệt được chỉ định
    /// </summary>
    [Description("Trả lại cho người phê duyệt được chỉ định")]
    ReturnToApprover = 11,
    /// <summary>
    /// Thêm người ký
    /// </summary>
    [Description("Thêm người ký")]
    Additional = 12,
    /// <summary>
    /// Đồng ý và thêm người ký
    /// </summary>
    [Description("Đồng ý và thêm người ký")]
    AgreeAndSign = 13,
    /// <summary>
    /// Xử lý
    /// </summary>
    [Description("Xử lý")]
    Processing = 14,
    /// <summary>
    /// Chuyển giao
    /// </summary>
    [Description("Chuyển giao")]
    Transfer = 15,
}
