using System;

namespace LINGYUN.Abp.Identity.Session;
/// <summary>
/// Cấu hình dùng cho quản lý phiên
/// </summary>
public class IdentitySessionCheckOptions
{
    /// <summary>
    /// Thời lượng duy trì quyền truy cập
    /// Mặc định: 1 phút
    /// </summary>
    /// <remarks>
    /// Khoảng thời gian giữa các lần làm mới phiên trong cache
    /// </remarks>
    public TimeSpan KeepAccessTimeSpan { get; set; }
    /// <summary>
    /// Khoảng thời gian đồng bộ phiên (ms)
    /// Mặc định: 10 phút
    /// </summary>
    /// <remarks>
    /// Khoảng thời gian đồng bộ từ cache sang bộ nhớ bền vững
    /// </remarks>
    public TimeSpan SessionSyncTimeSpan { get; set; }
    public IdentitySessionCheckOptions()
    {
        KeepAccessTimeSpan = TimeSpan.FromMinutes(1);
        SessionSyncTimeSpan = TimeSpan.FromMinutes(10);
    }
}
