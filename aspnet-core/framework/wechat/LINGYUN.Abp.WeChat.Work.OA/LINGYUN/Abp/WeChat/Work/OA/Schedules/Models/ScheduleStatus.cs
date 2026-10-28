using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Trạng thái lịch trình
/// </summary>
[Description("Trạng thái lịch trình")]
public enum ScheduleStatus : uint
{
    /// <summary>
    /// Bình thường
    /// </summary>
    [Description("Bình thường")]
    Normal = 0,
    /// <summary>
    /// Đã hủy
    /// </summary>
    [Description("Đã hủy")]
    Cancelled = 1,
}
