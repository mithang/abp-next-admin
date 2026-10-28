namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Thời gian tồn tại của thông báo
/// Sau khi gửi sẽ hủy đăng ký của người dùng, tương tự WeChat Mini Program
/// </summary>
public enum NotificationLifetime
{
    /// <summary>
    /// Lưu trữ bền vững
    /// </summary>
    Persistent = 0,
    /// <summary>
    /// Một lần
    /// </summary>
    OnlyOne = 1
}
