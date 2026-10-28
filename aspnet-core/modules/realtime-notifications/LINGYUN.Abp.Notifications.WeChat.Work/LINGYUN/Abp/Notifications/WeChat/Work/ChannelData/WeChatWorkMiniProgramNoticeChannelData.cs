using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.WeChat.Work.Messages.Models;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Payload tin nhắn thông báo mini-program
/// </summary>
[NotificationChannelData(WeChatWorkNotificationPublishProvider.ProviderName, Priority = 100)]
public class WeChatWorkMiniProgramNoticeChannelData : WeChatWorkChannelData
{
    public override WeChatWorkMessageKind Kind => WeChatWorkMessageKind.MiniProgramNotice;

    [NotificationChannelProperty(WeChatWorkNotificationDataKeys.MiniProgramMessage)]
    public virtual MiniProgramMessage? MiniProgram { get; set; }
}
