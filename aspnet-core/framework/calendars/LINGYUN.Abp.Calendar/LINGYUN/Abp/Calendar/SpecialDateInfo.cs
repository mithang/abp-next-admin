using System;

namespace LINGYUN.Abp.Calendar;
/// <summary>
/// Ngày đặc biệt
/// </summary>
public class SpecialDateInfo
{
    /// <summary>
    /// Ngày
    /// </summary>
    public DateOnly Date { get; set; }
    /// <summary>
    /// Loại ngày đặc biệt
    /// </summary>
    public SpecialDateType Type { get; set; }
    /// <summary>
    /// Mô tả ngày đặc biệt
    /// </summary>
    public string? Description { get; set; }
}
