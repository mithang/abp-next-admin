namespace LINGYUN.Abp.Notifications.WxPusher;

/// <summary>
/// Khóa dữ liệu thông báo WxPusher
/// </summary>
public static class WxPusherNotificationDataKeys
{
    public const string Prefix = "wx-pusher:";

    /// <summary>
    /// Địa chỉ chuyển hướng sau khi nhấn vào tin nhắn
    /// </summary>
    public const string Url = Prefix + "url";
}
