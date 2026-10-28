using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.WeChat.Work.Messages.Models;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Payload tin nhắn thoại
/// </summary>
[NotificationChannelData(WeChatWorkWebhookNotificationProvider.ProviderName, Priority = 700)]
public class WeChatWorkWebhookVoiceChannelData : WeChatWorkWebhookChannelData
{
    public override WeChatWorkWebhookMessageKind Kind => WeChatWorkWebhookMessageKind.Voice;

    /// <summary>
    /// Nội dung tin nhắn thoại (ID tài nguyên)
    /// </summary>
    [NotificationChannelProperty(WeChatWorkWebhookNotificationDataKeys.Voice)]
    public virtual WebhookVoiceMessage? Voice { get; set; }
}
