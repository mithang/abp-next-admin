using System;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Calendar;

public interface IWorkdayCalendarStore
{
    /// <summary>
    /// Lấy ngày đặc biệt
    /// </summary>
    /// <param name="date">Ngày</param>
    /// <returns></returns>
    Task<SpecialDateInfo?> FindSpecialDateAsync(DateOnly date);
    /// <summary>
    /// Lấy lịch làm việc mặc định
    /// </summary>
    Task<WorkdayCalendarInfo?> FindDefaultCalendarAsync();
}
