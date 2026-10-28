namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Loại thông báo
/// </summary>
public enum NotificationType
{
    /// <summary>
    /// Ứng dụng (chỉ đối với tenant hiện tại)
    /// </summary>
    Application = 0,
    /// <summary>
    /// Thông báo hệ thống (phát hành toàn cục)
    /// </summary>
    System = 10,
    /// <summary>
    /// Người dùng (người dùng tương ứng, chịu sự kiểm soát của tenant)
    /// </summary>
    User = 20,
    /// <summary>
    /// Callback phía máy chủ, người dùng không nên xử lý
    /// </summary>
    ServiceCallback = 30,
}
