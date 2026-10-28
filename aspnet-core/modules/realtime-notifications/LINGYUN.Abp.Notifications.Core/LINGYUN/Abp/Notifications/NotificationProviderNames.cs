namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Nhà cung cấp thông báo tích hợp sẵn
/// </summary>
public static class NotificationProviderNames
{
    /// <summary>
    /// Thông báo thời gian thực SignalR
    /// </summary>
    public const string SignalR = "SignalR";
    /// <summary>
    /// Thông báo SMS
    /// </summary>
    public const string Sms = "Sms";
    /// <summary>
    /// Thông báo email
    /// </summary>
    public const string Emailing = "Emailing";
    /// <summary>
    /// Thông báo mẫu của Mini Program WeChat
    /// </summary>
    public const string WechatMiniProgram = "WeChat.MiniProgram";
    /// <summary>
    /// Tin nhắn ứng dụng WeChat doanh nghiệp
    /// </summary>
    public const string WechatWork = "WeChat.Work";
}
