using LINGYUN.Abp.Notifications;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Payload tin nhắn markdown
/// </summary>
[NotificationChannelData(WeChatWorkWebhookNotificationProvider.ProviderName, Priority = 200)]
public class WeChatWorkWebhookMarkdownChannelData : WeChatWorkWebhookChannelData
{
    public override WeChatWorkWebhookMessageKind Kind => WeChatWorkWebhookMessageKind.Markdown;

    /// <summary>
    /// Nội dung markdown
    /// </summary>
    [NotificationChannelProperty(WeChatWorkWebhookNotificationDataKeys.Markdown)]
    public virtual string? Content { get; set; }
}
