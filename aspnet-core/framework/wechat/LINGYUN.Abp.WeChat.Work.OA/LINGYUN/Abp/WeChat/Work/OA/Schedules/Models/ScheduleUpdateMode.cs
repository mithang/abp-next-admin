using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Chế độ thao tác cập nhật lịch trình
/// </summary>
[Description("Chế độ thao tác cập nhật lịch trình")]
public enum ScheduleUpdateMode : uint
{
    /// <summary>
    /// Sửa tất cả
    /// </summary>
    [Description("Sửa tất cả")]
    ModifyAll = 0,
    /// <summary>
    /// Chỉ sửa lịch trình này
    /// </summary>
    [Description("Chỉ sửa lịch trình này")]
    ModifyThisSchedule = 1,
    /// <summary>
    /// Sửa tất cả lịch trình trong tương lai
    /// </summary>
    [Description("Sửa tất cả lịch trình trong tương lai")]
    ModifyAllFutureSchedules = 2,
}
