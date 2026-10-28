using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.Schedules.Models;
/// <summary>
/// Loại lặp lại
/// </summary>
[Description("Loại lặp lại")]
public enum ScheduleReminderRepeatType : uint
{
    /// <summary>
    /// Hàng ngày
    /// </summary>
    [Description("Hàng ngày")]
    Daily = 0,
    /// <summary>
    /// Hàng tuần
    /// </summary>
    [Description("Hàng tuần")]
    Weekly = 1,
    /// <summary>
    /// Hàng tháng
    /// </summary>
    [Description("Hàng tháng")]
    EveryMonth = 2,
    /// <summary>
    /// Hàng năm
    /// </summary>
    [Description("Hàng năm")]
    EveryYear = 5,
    /// <summary>
    /// Ngày làm việc
    /// </summary>
    [Description("Ngày làm việc")]
    WorkingDays = 7,
}
