using System;
using System.Collections.Generic;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Provider xác định sự tồn tại của dữ liệu kênh
/// </summary>
public class NotificationChannelDataPresenceProvider : INotificationChannelDataPresenceProvider, ISingletonDependency
{
    public virtual NotificationChannelDataPresenceMode GetPresenceMode(Type channelDataType)
    {
        return NotificationChannelDataPresence.GetPresenceMode(channelDataType);
    }

    public virtual IReadOnlyList<string> GetMatchingKeys(Type channelDataType)
    {
        return NotificationChannelDataPresence.GetMatchingKeys(channelDataType);
    }

    public virtual Func<NotificationData, bool> Create(Type channelDataType)
    {
        return NotificationChannelDataPresence.Create(channelDataType);
    }
}
