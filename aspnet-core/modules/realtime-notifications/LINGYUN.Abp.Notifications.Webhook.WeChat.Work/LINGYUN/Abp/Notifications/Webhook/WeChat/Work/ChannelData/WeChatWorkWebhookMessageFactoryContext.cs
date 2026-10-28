using LINGYUN.Abp.WeChat.Work.Messages;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Bối cảnh tạo tin nhắn Webhook WeChat Doanh nghiệp
/// </summary>
public class WeChatWorkWebhookMessageFactoryContext
{
    /// <summary>
    /// Tin nhắn thông báo
    /// </summary>
    public NotificationInfo Notification { get; }

    /// <summary>
    /// Dữ liệu chuẩn của thông báo (đã hoàn tất bản địa hóa và kết xuất mẫu)
    /// </summary>
    public NotificationStandardData StandardData { get; }

    /// <summary>
    /// Dữ liệu kênh (tải trọng)
    /// </summary>
    public WeChatWorkWebhookChannelData ChannelData { get; }

    /// <summary>
    /// Tùy chọn kênh
    /// </summary>
    public AbpNotificationsWebhookWeChatWorkOptions Options { get; }

    public WeChatWorkWebhookMessageFactoryContext(
        NotificationInfo notification,
        NotificationStandardData standardData,
        WeChatWorkWebhookChannelData channelData,
        AbpNotificationsWebhookWeChatWorkOptions options)
    {
        Notification = notification;
        StandardData = standardData;
        ChannelData = channelData;
        Options = options;
    }
}
