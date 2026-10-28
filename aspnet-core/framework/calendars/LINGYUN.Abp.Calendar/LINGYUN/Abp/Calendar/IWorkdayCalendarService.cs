using System;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Calendar;

public interface IWorkdayCalendarService
{
    /// <summary>
    /// Kiểm tra xem thời gian chỉ định có phải là ngày làm việc hay không
    /// </summary>
    Task<bool> IsWorkdayAsync(DateOnly date);
    /// <summary>
    /// Kiểm tra xem thời gian chỉ định có nằm trong giờ làm việc hay không
    /// </summary>
    /// <param name="dateTime"></param>
    /// <returns></returns>
    Task<bool> IsInWorkTimeAsync(DateTime dateTime);
    /// <summary>
    /// Lấy ngày làm việc tiếp theo
    /// </summary>
    /// <param name="date"></param>
    /// <returns></returns>
    Task<DateOnly> GetNextWorkdayAsync(DateOnly date);
}
