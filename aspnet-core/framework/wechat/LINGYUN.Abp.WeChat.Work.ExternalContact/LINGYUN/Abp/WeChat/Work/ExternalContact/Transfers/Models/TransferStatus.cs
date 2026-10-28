using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Models;
/// <summary>
/// Trạng thái bàn giao
/// </summary>
[Description("Trạng thái bàn giao")]
public enum TransferStatus
{
    /// <summary>
    /// Đã bàn giao xong
    /// </summary>
    [Description("Đã bàn giao xong")]
    Completed = 1,
    /// <summary>
    /// Đang chờ bàn giao
    /// </summary>
    [Description("Đang chờ bàn giao")]
    Pending = 2,
    /// <summary>
    /// Khách hàng từ chối
    /// </summary>
    [Description("Khách hàng từ chối")]
    CustomerReject = 3,
    /// <summary>
    /// Khách hàng của thành viên nhận bàn giao đã đạt giới hạn
    /// </summary>
    [Description("Khách hàng của thành viên nhận bàn giao đã đạt giới hạn")]
    ReachesLimit = 4
}
