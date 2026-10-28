using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Trạng thái nút phê duyệt
/// </summary>
public enum ApprovalSpRecordStatus : byte
{
    /// <summary>
    /// Đang phê duyệt
    /// </summary>
    [Description("Đang phê duyệt")]
    UnderApproval = 1,
    /// <summary>
    /// Đã đồng ý
    /// </summary>
    [Description("Đã đồng ý")]
    Passed = 2,
    /// <summary>
    /// Đã từ chối
    /// </summary>
    [Description("Đã từ chối")]
    Rejected = 3,
    /// <summary>
    /// Đã chuyển xét duyệt
    /// </summary>
    [Description("Đã chuyển xét duyệt")]
    Transferred = 4,
    /// <summary>
    /// Đã trả lại
    /// </summary>
    [Description("Đã trả lại")]
    Returned = 11,
    /// <summary>
    /// Đã ký bổ sung
    /// </summary>
    [Description("Đã ký bổ sung")]
    Signed = 12,
    /// <summary>
    /// Đã đồng ý và ký bổ sung
    /// </summary>
    [Description("Đã đồng ý và ký bổ sung")]
    AgreedAndSigned = 13,
}
