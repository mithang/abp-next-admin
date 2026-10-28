namespace LINGYUN.Abp.Features.LimitValidation;

public enum LimitPolicy : byte
{
    /// <summary>
    /// Giới hạn theo phút
    /// </summary>
    Minute = 0,
    /// <summary>
    /// Giới hạn theo giờ
    /// </summary>
    Hours = 10,
    /// <summary>
    /// Giới hạn theo ngày
    /// </summary>
    Days = 20,
    /// <summary>
    /// Giới hạn theo tuần
    /// </summary>
    Weeks = 30,
    /// <summary>
    /// Giới hạn theo tháng
    /// </summary>
    Month = 40,
    /// <summary>
    /// Giới hạn theo năm
    /// </summary>
    Years = 50
}
