namespace LINGYUN.Abp.Identity;
/// <summary>
/// Chính sách đăng nhập trùng lặp
/// </summary>
public enum ConcurrentLoginStrategy
{
    /// <summary>
    /// Chưa định nghĩa
    /// </summary>
    None,
    /// <summary>
    /// Giới hạn số lượng đăng nhập trên cùng thiết bị
    /// </summary>
    LogoutFromSameTypeDevicesLimit,
    /// <summary>
    /// Đăng xuất khỏi các đầu cùng loại thiết bị khác
    /// </summary>
    LogoutFromSameTypeDevices,
    /// <summary>
    /// Đăng xuất khỏi tất cả các thiết bị khác
    /// </summary>
    LogoutFromAllDevices
}
