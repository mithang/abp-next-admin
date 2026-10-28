using System;

namespace LINGYUN.Abp.Identity.Session;
public class IdentitySessionCleanupOptions
{
    /// <summary>
    /// Có bật dọn dẹp phiên hay không
    /// Mặc định: false
    /// </summary>
    public bool IsCleanupEnabled { get; set; }
    /// <summary>
    /// Khoảng thời gian dọn dẹp phiên (ms)
    /// Mặc định: 1 giờ
    /// </summary>
    public int CleanupPeriod { get; set; }
    /// <summary>
    /// Thời gian giữ phiên không hoạt động
    /// Mặc định: 30 ngày
    /// </summary>
    public TimeSpan InactiveTimeSpan { get; set; }
    public IdentitySessionCleanupOptions()
    {
        CleanupPeriod = 3_600_000;
        InactiveTimeSpan = TimeSpan.FromDays(30);
    }
}
