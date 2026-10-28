namespace LINGYUN.Abp.Notifications.PushPlus;

/// <summary>
/// Khóa dữ liệu thông báo PushPlus
/// </summary>
public static class PushPlusNotificationDataKeys
{
    public const string Prefix = "push-plus:";

    /// <summary>
    /// Địa chỉ webhook
    /// </summary>
    public const string Webhook = Prefix + "webhook";
    /// <summary>
    /// Địa chỉ callback
    /// </summary>
    public const string CallbackUrl = Prefix + "callback";
}
