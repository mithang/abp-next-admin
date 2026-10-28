using System;

namespace LINGYUN.Abp.Calendar;

public  class AbpCalendarOptions
{
    /// <summary>
    /// Phạm vi ngày làm việc mặc định
    /// Mặc định: thứ Hai đến thứ Sáu
    /// </summary>
    public DayOfWeek[] DefaultWorkdays { get; set; }
    /// <summary>
    /// Có bật giới hạn giờ làm việc hay không
    /// Mặc định: true
    /// </summary>
    public bool EnableWorkTimeRestriction { get; set; }
    /// <summary>
    /// Phạm vi giờ làm việc mặc định
    /// Mặc định: 09:00-12:00, 13:00-18:00
    /// </summary>
    public WorkTimeRange[] DefaultWorkTimes { get; set; }

    public AbpCalendarOptions()
    {
        DefaultWorkdays = new[]
        {
            DayOfWeek.Monday,
            DayOfWeek.Tuesday,
            DayOfWeek.Wednesday,
            DayOfWeek.Thursday,
            DayOfWeek.Friday
        };
        EnableWorkTimeRestriction = true;
        DefaultWorkTimes = new[]
        {
            new WorkTimeRange(new TimeSpan(9, 0, 0), new TimeSpan(12, 0, 0)),
            new WorkTimeRange(new TimeSpan(13, 0, 0), new TimeSpan(18, 0, 0)),
        };
    }
}
