using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.WeChat.Work.Messages.Models;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Payload tin nhắn hình ảnh
/// </summary>
[NotificationChannelData(WeChatWorkWebhookNotificationProvider.ProviderName, Priority = 400)]
public class WeChatWorkWebhookImageChannelData : WeChatWorkWebhookChannelData
{
    public override WeChatWorkWebhookMessageKind Kind => WeChatWorkWebhookMessageKind.Image;

    /// <summary>
    /// Nội dung hình ảnh (mã hóa base64, không vượt quá 2MB)
    /// </summary>
    [NotificationChannelProperty(WeChatWorkWebhookNotificationDataKeys.Image)]
    public virtual WebhookImageMessage? Image { get; set; }
}
