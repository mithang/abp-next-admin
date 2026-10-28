namespace LINGYUN.Abp.AuditLogging.Elasticsearch;
/// <summary>
/// Khoảng thời gian cuộn chỉ mục
/// </summary>
public enum RollingInterval
{
    /// <summary>
    /// Tên chỉ mục không cuộn theo thời gian, trong chỉ mục không chứa thông tin phạm vi thời gian
    /// </summary>
    Infinite,
    /// <summary>
    /// Cuộn mỗi phút, hậu tố chỉ mục thêm yyyyMMddHHmm
    /// </summary>
    Minute,
    /// <summary>
    /// Cuộn mỗi giờ, hậu tố chỉ mục thêm yyyyMMddHH
    /// </summary>
    Hour,
    /// <summary>
    /// Cuộn mỗi ngày, hậu tố chỉ mục thêm yyyyMMdd
    /// </summary>
    Day,
    /// <summary>
    /// Cuộn mỗi tháng, hậu tố chỉ mục thêm yyyyMM
    /// </summary>
    Month,
    /// <summary>
    /// Cuộn mỗi năm, hậu tố chỉ mục thêm yyyy
    /// </summary>
    Year,
}
