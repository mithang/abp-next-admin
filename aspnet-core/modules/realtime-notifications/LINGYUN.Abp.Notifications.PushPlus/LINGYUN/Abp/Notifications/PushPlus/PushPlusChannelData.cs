using LINGYUN.Abp.Notifications;

namespace LINGYUN.Abp.Notifications.PushPlus;

/// <summary>
/// Dữ liệu kênh PushPlus (payload)
/// </summary>
/// <remarks>
/// webhook và callback là "tham số tùy chọn" chứ không phải "định danh payload" loại trừ lẫn nhau:
/// Ghi bất kỳ tham số nào trong số đó tức là nhà sản xuất muốn sử dụng kênh PushPlus,
/// Do đó chế độ xác định sự tồn tại được khai báo là <see cref="NotificationChannelDataPresenceMode.AnyDeclaredProperty"/>.
/// </remarks>
[NotificationChannelData(
    PushPlusNotificationPublishProvider.ProviderName,
    Priority = 100,
    Presence = NotificationChannelDataPresenceMode.AnyDeclaredProperty)]
public class PushPlusChannelData : NotificationChannelData
{
    /// <summary>
    /// Địa chỉ webhook
    /// </summary>
    [NotificationChannelProperty(PushPlusNotificationDataKeys.Webhook)]
    public virtual string? Webhook { get; set; }

    /// <summary>
    /// Địa chỉ callback
    /// </summary>
    [NotificationChannelProperty(PushPlusNotificationDataKeys.CallbackUrl)]
    public virtual string? CallbackUrl { get; set; }
}
