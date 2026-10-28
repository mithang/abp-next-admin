using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.WeChat.Work.Messages.Models;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Payload tin nhắn thoại
/// </summary>
[NotificationChannelData(WeChatWorkNotificationPublishProvider.ProviderName, Priority = 600)]
public class WeChatWorkVoiceChannelData : WeChatWorkChannelData
{
    public override WeChatWorkMessageKind Kind => WeChatWorkMessageKind.Voice;

    [NotificationChannelProperty(WeChatWorkNotificationDataKeys.VoiceMessage)]
    public virtual MediaMessage? Voice { get; set; }
}
