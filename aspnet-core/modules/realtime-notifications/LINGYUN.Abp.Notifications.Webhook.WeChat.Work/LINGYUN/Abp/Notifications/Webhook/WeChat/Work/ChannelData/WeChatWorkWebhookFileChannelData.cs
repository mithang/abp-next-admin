using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.WeChat.Work.Messages.Models;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Payload tin nhắn tệp
/// </summary>
[NotificationChannelData(WeChatWorkWebhookNotificationProvider.ProviderName, Priority = 600)]
public class WeChatWorkWebhookFileChannelData : WeChatWorkWebhookChannelData
{
    public override WeChatWorkWebhookMessageKind Kind => WeChatWorkWebhookMessageKind.File;

    /// <summary>
    /// Nội dung tin nhắn tệp (ID tài nguyên)
    /// </summary>
    [NotificationChannelProperty(WeChatWorkWebhookNotificationDataKeys.File)]
    public virtual WebhookFileMessage? File { get; set; }
}
