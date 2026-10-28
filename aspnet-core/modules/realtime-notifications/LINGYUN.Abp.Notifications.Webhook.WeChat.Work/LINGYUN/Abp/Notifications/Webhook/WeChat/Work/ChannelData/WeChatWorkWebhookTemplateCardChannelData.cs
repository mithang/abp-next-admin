using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.WeChat.Work.Messages.Models;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Tải trọng tin nhắn thẻ mẫu
/// </summary>
/// <remarks>
/// Hai triển khai cụ thể của kiểu trừu tượng <see cref="WebhookTemplateCardMessage"/>
/// (<see cref="WebhookTextNoticeCardMessage"/> / <see cref="WebhookNewsNoticeCardMessage"/>)
/// đều cần bộ chuyển đổi đa hình JSON mới có thể đi-về trong dữ liệu thông báo, do mô-đun kênh đăng ký.
/// </remarks>
[NotificationChannelData(WeChatWorkWebhookNotificationProvider.ProviderName, Priority = 800)]
public class WeChatWorkWebhookTemplateCardChannelData : WeChatWorkWebhookChannelData
{
    public override WeChatWorkWebhookMessageKind Kind => WeChatWorkWebhookMessageKind.TemplateCard;

    /// <summary>
    /// Thân tin nhắn thẻ mẫu
    /// </summary>
    [NotificationChannelProperty(WeChatWorkWebhookNotificationDataKeys.TemplateCard)]
    public virtual WebhookTemplateCardMessage? TemplateCard { get; set; }
}
