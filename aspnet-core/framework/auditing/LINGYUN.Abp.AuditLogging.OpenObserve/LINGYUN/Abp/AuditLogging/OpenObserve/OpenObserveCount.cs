namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Kết quả truy vấn thống kê
/// </summary>
/// <remarks>
/// Cấu trúc trúng khớp tương ứng với <c>select count(*) as total from ...</c>
/// </remarks>
public class OpenObserveCount
{
    public long Total { get; set; }
}
