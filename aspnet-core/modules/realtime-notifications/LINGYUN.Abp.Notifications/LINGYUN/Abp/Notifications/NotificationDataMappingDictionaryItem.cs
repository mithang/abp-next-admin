using System;

namespace LINGYUN.Abp.Notifications;

public class NotificationDataMappingDictionaryItem
{
    /// <summary>
    /// Tên thông báo
    /// </summary>
    public string Name { get; }
    /// <summary>
    /// Phương thức chuyển đổi
    /// </summary>
    public Func<NotificationData, NotificationData> MappingFunc { get; private set; }

    public NotificationDataMappingDictionaryItem(string name, Func<NotificationData, NotificationData> func)
    {
        Name = name;
        MappingFunc = func;
    }

    public void Replace(Func<NotificationData, NotificationData> func)
    {
        MappingFunc = func;
    }
}
