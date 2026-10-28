using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.Calendar;

public class WorkdayCalendarService : IWorkdayCalendarService, ITransientDependency
{
    private readonly AbpCalendarOptions _options;
    private readonly IWorkdayCalendarStore _workdayCalendarStore;

    public WorkdayCalendarService(
        IOptionsMonitor<AbpCalendarOptions> options, 
        IWorkdayCalendarStore workdayCalendarStore)
    {
        _options = options.CurrentValue;
        _workdayCalendarStore = workdayCalendarStore;
    }

    public async virtual Task<DateOnly> GetNextWorkdayAsync(DateOnly date)
    {
        var nextDay = date.AddDays(1);
        // Giới hạn trong 31 ngày
        var maxAttempts = 30;

        for (var i = 0; i < maxAttempts; i++)
        {
            if (await IsWorkdayAsync(nextDay))
            {
                return nextDay;
            }
            nextDay = nextDay.AddDays(1);
        }

        // Nếu không tìm thấy ngày làm việc nào trong 30 ngày, trả về ngày gốc + 1 ngày
        return date.AddDays(1);
    }

    public async virtual Task<bool> IsWorkdayAsync(DateOnly date)
    {
        // Định nghĩa ngày làm việc đặc biệt
        var specialDate = await _workdayCalendarStore.FindSpecialDateAsync(date);
        if (specialDate != null)
        {
            return specialDate.Type == SpecialDateType.SpecialWorkday;
        }
        // Lấy định nghĩa lịch làm việc mặc định
        var calendar = await _workdayCalendarStore.FindDefaultCalendarAsync();
        if (calendar == null)
        {
            // Chưa định nghĩa lịch làm việc mặc định, lấy phạm vi ngày làm việc do hệ thống định nghĩa
            return _options.DefaultWorkdays.Contains(date.DayOfWeek);
        }
        // Phạm vi ngày làm việc đặc biệt
        if (calendar.SpecialDates != null &&
            calendar.SpecialDates.Any(x => x.Date == date && x.Type == SpecialDateType.SpecialWorkday))
        {
            return true;
        }
        // Phạm vi ngày làm việc
        if (!calendar.Workdays.Contains(date.DayOfWeek))
        {
            return false;
        }

        return false;
    }

    public async virtual Task<bool> IsInWorkTimeAsync(DateTime time)
    {
        var nowDate = DateOnly.FromDateTime(time);
        // Định nghĩa ngày làm việc đặc biệt
        var specialDate = await _workdayCalendarStore.FindSpecialDateAsync(nowDate);
        if (specialDate != null)
        {
            return specialDate.Type == SpecialDateType.SpecialWorkday;
        }
        // Lấy định nghĩa lịch làm việc mặc định
        var calendar = await _workdayCalendarStore.FindDefaultCalendarAsync();
        if (calendar == null)
        {
            // Chưa định nghĩa lịch làm việc mặc định, lấy phạm vi ngày làm việc do hệ thống định nghĩa
            if (!_options.DefaultWorkdays.Contains(nowDate.DayOfWeek))
            {
                return false;
            }
            if (_options.EnableWorkTimeRestriction &&
                !_options.DefaultWorkTimes.Any(timeRange => time.TimeOfDay >= timeRange.StartTime && time.TimeOfDay <= timeRange.EndTime))
            {
                return false;
            }

            return true;
        }
        // Phạm vi ngày làm việc đặc biệt
        if (calendar.SpecialDates != null &&
            calendar.SpecialDates.Any(x => x.Date == nowDate && x.Type == SpecialDateType.SpecialWorkday))
        {
            return true;
        }
        // Phạm vi ngày làm việc
        if (!calendar.Workdays.Contains(nowDate.DayOfWeek))
        {
            return false;
        }
        // Phạm vi giờ làm việc
        if (calendar.EnableWorkTimeRestriction && 
            calendar.WorkTimes != null)
        {
            return calendar.WorkTimes.Any(timeRange => time.TimeOfDay >= timeRange.StartTime && time.TimeOfDay <= timeRange.EndTime);
        }

        return false;
    }
}
