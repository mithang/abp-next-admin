using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.WeChat.Work.Messages.Models;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Payload tin nhắn thẻ văn bản
/// </summary>
[NotificationChannelData(WeChatWorkNotificationPublishProvider.ProviderName, Priority = 400)]
public class WeChatWorkTextCardChannelData : WeChatWorkChannelData
{
    public override WeChatWorkMessageKind Kind => WeChatWorkMessageKind.TextCard;

    [NotificationChannelProperty(WeChatWorkNotificationDataKeys.TextCardMessage)]
    public virtual TextCardMessage? TextCard { get; set; }
}
