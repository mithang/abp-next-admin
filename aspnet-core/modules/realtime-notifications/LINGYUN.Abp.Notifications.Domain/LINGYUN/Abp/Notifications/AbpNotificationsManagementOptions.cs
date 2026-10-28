using System;

namespace LINGYUN.Abp.Notifications;

public class AbpNotificationsManagementOptions
{
    /// <summary>
    /// Default: true.
    /// </summary>
    public bool SaveStaticNotificationsToDatabase { get; set; }
    /// <summary>
    /// Default: false.
    /// </summary>
    public bool IsDynamicNotificationsStoreEnabled { get; set; }
    /// <summary>
    /// Thời gian làm mới bộ nhớ đệm
    /// default: 30 seconds
    /// </summary>
    public TimeSpan NotificationsCacheRefreshInterval { get; set; }
    /// <summary>
    /// Thời gian hết hạn dấu thời gian của yêu cầu
    /// default: 2 minutes
    /// </summary>
    public TimeSpan NotificationsCacheStampTimeOut { get; set; }
    /// <summary>
    /// Thời gian hết hạn dấu thời gian
    /// default: 30 days
    /// </summary>
    public TimeSpan NotificationsCacheStampExpiration { get; set; }
    public AbpNotificationsManagementOptions()
    {
        SaveStaticNotificationsToDatabase = true;

        NotificationsCacheRefreshInterval = TimeSpan.FromSeconds(30);
        NotificationsCacheStampTimeOut = TimeSpan.FromMinutes(2);
        // Hết hạn sau 30 ngày sẽ làm mới lại bộ nhớ đệm
        NotificationsCacheStampExpiration = TimeSpan.FromDays(30);
    }
}
