using LINGYUN.Abp.Notifications;

namespace LINGYUN.Abp.Notifications.WxPusher;

/// <summary>
/// Dữ liệu kênh WxPusher (tải trọng)
/// </summary>
/// <remarks>
/// Tính tồn tại được suy ra từ khóa url (mặc định Presence = DeclaredProperties), không cần triển khai phương thức xác định.
/// </remarks>
[NotificationChannelData(WxPusherNotificationPublishProvider.ProviderName, Priority = 100)]
public class WxPusherChannelData : NotificationChannelData
{
    /// <summary>
    /// Địa chỉ chuyển hướng sau khi nhấp vào thông báo
    /// </summary>
    [NotificationChannelProperty(WxPusherNotificationDataKeys.Url)]
    public virtual string? Url { get; set; }
}
