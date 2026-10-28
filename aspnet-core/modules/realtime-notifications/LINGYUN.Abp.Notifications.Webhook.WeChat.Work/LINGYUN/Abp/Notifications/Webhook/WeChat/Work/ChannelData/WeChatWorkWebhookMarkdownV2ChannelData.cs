using LINGYUN.Abp.Notifications;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

/// <summary>
/// Tải trọng tin nhắn markdown_v2
/// </summary>
/// <remarks>
/// markdown_v2 hỗ trợ cú pháp phong phú hơn như bảng, khối mã,
/// Xem chi tiết tại https://developer.work.weixin.qq.com/document/path/99110#markdown-v2%E7%B1%BB%E5%9E%8B
/// </remarks>
[NotificationChannelData(WeChatWorkWebhookNotificationProvider.ProviderName, Priority = 300)]
public class WeChatWorkWebhookMarkdownV2ChannelData : WeChatWorkWebhookChannelData
{
    public override WeChatWorkWebhookMessageKind Kind => WeChatWorkWebhookMessageKind.MarkdownV2;

    /// <summary>
    /// Nội dung markdown_v2
    /// </summary>
    [NotificationChannelProperty(WeChatWorkWebhookNotificationDataKeys.MarkdownV2)]
    public virtual string? Content { get; set; }
}
