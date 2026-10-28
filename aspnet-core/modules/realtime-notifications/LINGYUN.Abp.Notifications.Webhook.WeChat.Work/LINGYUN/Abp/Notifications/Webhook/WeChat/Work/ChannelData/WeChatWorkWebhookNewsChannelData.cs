using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.WeChat.Work.Messages.Models;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Payload tin nhắn bài viết (hình ảnh và văn bản)
/// </summary>
[NotificationChannelData(WeChatWorkWebhookNotificationProvider.ProviderName, Priority = 500)]
public class WeChatWorkWebhookNewsChannelData : WeChatWorkWebhookChannelData
{
    public override WeChatWorkWebhookMessageKind Kind => WeChatWorkWebhookMessageKind.News;

    /// <summary>
    /// Nội dung tin nhắn bài viết (hình ảnh và văn bản)
    /// </summary>
    [NotificationChannelProperty(WeChatWorkWebhookNotificationDataKeys.News)]
    public virtual WebhookNewsMessage? News { get; set; }
}
