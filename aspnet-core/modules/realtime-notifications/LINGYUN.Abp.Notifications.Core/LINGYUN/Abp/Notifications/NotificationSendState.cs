namespace LINGYUN.Abp.Notifications;
/// <summary>
/// Trạng thái gửi
/// </summary>
public enum NotificationSendState
{
    /// <summary>
    /// Chưa gửi
    /// </summary>
    None,
    /// <summary>
    /// Nhà cung cấp đã bị vô hiệu hóa
    /// </summary>
    Disabled,
    /// <summary>
    /// Đã gửi
    /// </summary>
    Sent,
    /// <summary>
    /// Gửi thất bại
    /// </summary>
    Failed
}
