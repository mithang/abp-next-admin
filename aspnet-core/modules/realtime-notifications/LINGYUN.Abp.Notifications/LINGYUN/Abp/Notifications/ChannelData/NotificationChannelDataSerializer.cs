using System;
using Volo.Abp;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Bộ tuần tự hóa dữ liệu kênh thông báo (tải trọng)
/// </summary>
/// <remarks>
/// <para>
/// Cổng vào thống nhất phía nhà sản xuất, chịu trách nhiệm ghi tải trọng kiểu mạnh vào <see cref="NotificationData"/>。
/// </para>
/// <para>
/// Việc ghi tải trọng mang tính "khai báo": trên kiểu tải trọng có <see cref="NotificationChannelPropertyAttribute"/>
/// quyết định ghi những khóa nào và chuyển đổi ra sao, do đó phía nhà sản xuất và phía triển khai kênh dùng chung cùng một định nghĩa hợp đồng,
/// sẽ không xảy ra tình trạng "một bên đã ghi khóa, bên còn lại không bao giờ đọc được".
/// </para>
/// </remarks>
public class NotificationChannelDataSerializer : INotificationChannelDataSerializer, ISingletonDependency
{
    protected INotificationChannelDataAccessor Accessor { get; }
    protected INotificationChannelDataPresenceProvider PresenceProvider { get; }

    public NotificationChannelDataSerializer(
        INotificationChannelDataAccessor accessor,
        INotificationChannelDataPresenceProvider presenceProvider)
    {
        Accessor = accessor;
        PresenceProvider = presenceProvider;
    }

    public virtual NotificationData Write<TChannelData>(NotificationData notificationData, TChannelData channelData)
        where TChannelData : class
    {
        Check.NotNull(notificationData, nameof(notificationData));
        Check.NotNull(channelData, nameof(channelData));

        return Write(notificationData, (NotificationChannelData)(object)channelData);
    }

    public virtual NotificationData Write(NotificationData notificationData, NotificationChannelData channelData)
    {
        Check.NotNull(notificationData, nameof(notificationData));
        Check.NotNull(channelData, nameof(channelData));

        foreach (var property in NotificationChannelDataPropertyCache.GetProperties(channelData.GetType()))
        {
            var value = property.GetValue(channelData);
            if (value == null)
            {
                continue;
            }

            Accessor.Set(notificationData, property.Key, property.PropertyType, value, property.Format);
        }

        return notificationData;
    }

    public virtual NotificationData Clear<TChannelData>(NotificationData notificationData)
        where TChannelData : class
    {
        Check.NotNull(notificationData, nameof(notificationData));

        return Clear(notificationData, typeof(TChannelData));
    }

    public virtual NotificationData Clear(NotificationData notificationData, Type channelDataType)
    {
        Check.NotNull(notificationData, nameof(notificationData));
        Check.NotNull(channelDataType, nameof(channelDataType));

        foreach (var property in NotificationChannelDataPropertyCache.GetProperties(channelDataType))
        {
            notificationData.ExtraProperties.Remove(property.Key);
        }

        return notificationData;
    }

    public virtual bool Has<TPayload>(NotificationData notificationData)
        where TPayload : class
    {
        Check.NotNull(notificationData, nameof(notificationData));

        return PresenceProvider.Create(typeof(TPayload))(notificationData);
    }
}
