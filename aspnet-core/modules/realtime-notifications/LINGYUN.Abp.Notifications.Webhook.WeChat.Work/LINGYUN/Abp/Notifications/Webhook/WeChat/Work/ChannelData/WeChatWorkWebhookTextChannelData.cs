using LINGYUN.Abp.Notifications;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Payload tin nhắn văn bản
/// </summary>
[NotificationChannelData(WeChatWorkWebhookNotificationProvider.ProviderName, Priority = 100)]
public class WeChatWorkWebhookTextChannelData : WeChatWorkWebhookChannelData
{
    public override WeChatWorkWebhookMessageKind Kind => WeChatWorkWebhookMessageKind.Text;

    /// <summary>
    /// Nội dung văn bản
    /// </summary>
    [NotificationChannelProperty(WeChatWorkWebhookNotificationDataKeys.Text)]
    public virtual string? Content { get; set; }
}
