using System;
using Volo.Abp.Collections;

namespace LINGYUN.Abp.Notifications;

public class AbpNotificationsPublishOptions
{
    public const string DefaultDateTimeFormat = "yyyy-MM-dd HH:mm:ss";
    /// <summary>
    /// Tập hợp nhà cung cấp phát hành thông báo tùy chỉnh
    /// </summary>
    public ITypeList<INotificationPublishProvider> PublishProviders { get; }
    /// <summary>
    /// Thời gian hết hạn
    /// Mặc định 60 ngày
    /// </summary>
    public TimeSpan ExpirationTime { get; set; }
    /// <summary>
    /// Định dạng tuần tự hóa ngày giờ mặc định
    /// </summary>
    /// <remarks>
    /// Mặc định: yyyy-MM-dd HH:mm:ss
    /// </remarks>
    public string DateTimeFormat { get; set; }
    public AbpNotificationsPublishOptions()
    {
        PublishProviders = new TypeList<INotificationPublishProvider>();

        ExpirationTime = TimeSpan.FromDays(60);
        DateTimeFormat = DefaultDateTimeFormat;
    }
}
