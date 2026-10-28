using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Quyền của thành viên trong phạm vi thông báo lịch
/// </summary>
[Description("Quyền của thành viên trong phạm vi thông báo lịch")]
public enum CalendarSharePermission
{
    /// <summary>
    /// Có thể xem
    /// </summary>
    [Description("Có thể xem")]
    View = 1,
    /// <summary>
    /// Chỉ xem trạng thái bận/rảnh
    /// </summary>
    [Description("Chỉ xem trạng thái bận/rảnh")]
    OnlyBusy = 3
}
