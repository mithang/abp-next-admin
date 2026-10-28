using System.ComponentModel;

namespace LINGYUN.Abp.Calendar;
/// <summary>
/// Loại ngày đặc biệt
/// </summary>
public enum SpecialDateType
{
    /// <summary>
    /// Ngày lễ theo luật định
    /// </summary>
    [Description("Ngày lễ theo luật định")]
    Holiday = 0,
    /// <summary>
    /// Ngày làm việc đặc biệt
    /// </summary>
    [Description("Ngày làm việc đặc biệt")]
    SpecialWorkday = 1,
    /// <summary>
    /// Ngày nghỉ tùy chỉnh
    /// </summary>
    [Description("Ngày nghỉ tùy chỉnh")]
    CustomHoliday = 2
}
