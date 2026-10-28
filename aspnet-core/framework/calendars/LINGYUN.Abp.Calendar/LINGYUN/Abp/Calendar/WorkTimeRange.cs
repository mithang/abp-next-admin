using System;

namespace LINGYUN.Abp.Calendar;
/// <summary>
/// Phạm vi thời gian làm việc
/// </summary>
public class WorkTimeRange
{
    /// <summary>
    /// Thời gian bắt đầu
    /// </summary>
    public TimeSpan StartTime { get; set; }
    /// <summary>
    /// Thời gian kết thúc
    /// </summary>
    public TimeSpan EndTime { get; set; }
    public WorkTimeRange()
    {

    }

    public WorkTimeRange(TimeSpan startTime, TimeSpan endTime)
    {
        StartTime = startTime;
        EndTime = endTime;
    }
}
