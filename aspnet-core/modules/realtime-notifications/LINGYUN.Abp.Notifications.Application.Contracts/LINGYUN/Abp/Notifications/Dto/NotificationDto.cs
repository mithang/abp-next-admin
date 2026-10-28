namespace LINGYUN.Abp.Notifications;

public class NotificationDto
{
    /// <summary>
    /// Tên thông báo
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public string? DisplayName { get; set; }
    /// <summary>
    /// Mô tả
    /// </summary>
    public string? Description { get; set; }
    /// <summary>
    /// Loại vòng đời
    /// </summary>
    public NotificationLifetime Lifetime { get; set; }
    /// <summary>
    /// Loại thông báo
    /// </summary>
    public NotificationType Type { get; set; }
    /// <summary>
    /// Loại nội dung thông báo
    /// </summary>
    public NotificationContentType ContentType { get; set; }
}
