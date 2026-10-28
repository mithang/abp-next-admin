using System;

namespace LINGYUN.Abp.Calendar;

/// <summary>
/// Thông tin lịch làm việc
/// </summary>
public class WorkdayCalendarInfo
{
    /// <summary>
    /// Tên lịch
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Lịch mặc định
    /// </summary>
    public bool IsDefault { get; set; }
    /// <summary>
    /// Phạm vi ngày làm việc
    /// </summary>
    public DayOfWeek[] Workdays { get; set; } = default!;
    /// <summary>
    /// Phạm vi thời gian làm việc
    /// </summary>
    public WorkTimeRange[]? WorkTimes { get; set; }
    /// <summary>
    /// Có bật giới hạn thời gian làm việc hay không
    /// </summary>
    public bool EnableWorkTimeRestriction { get; set; }
    /// <summary>
    /// Danh sách ngày đặc biệt
    /// </summary>
    public SpecialDateInfo[]? SpecialDates { get; set; }
}
