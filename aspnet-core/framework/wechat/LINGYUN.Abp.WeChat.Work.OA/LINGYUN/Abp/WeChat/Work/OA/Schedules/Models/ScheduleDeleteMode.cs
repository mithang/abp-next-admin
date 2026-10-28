using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Chế độ thao tác xóa lịch trình
/// </summary>
[Description("Chế độ thao tác xóa lịch trình")]
public enum ScheduleDeleteMode : uint
{
    /// <summary>
    /// Xóa tất cả lịch trình
    /// </summary>
    [Description("Xóa tất cả lịch trình")]
    DeleteAll = 0,
    /// <summary>
    /// Chỉ xóa lịch trình này
    /// </summary>
    [Description("Chỉ xóa lịch trình này")]
    DeleteThisSchedule = 1,
    /// <summary>
    /// Xóa lịch trình lần này và các lịch trình sau đó
    /// </summary>
    [Description("Xóa lịch trình lần này và các lịch trình sau đó")]
    DeleteAllFutureSchedules = 2,
}
