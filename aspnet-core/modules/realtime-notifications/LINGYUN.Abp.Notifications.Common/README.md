# LINGYUN.Abp.Notifications.Common

Mô-đun chung của hệ thống thông báo, cung cấp định nghĩa cơ sở và chức năng dùng chung của hệ thống thông báo.

## Tính năng

* Định nghĩa thông báo
  * Định nghĩa nhóm thông báo
  * Định nghĩa loại thông báo
  * Định nghĩa mức độ thông báo
* Lớp công cụ chung
  * Xử lý dữ liệu thông báo
  * Quản lý trạng thái thông báo
* Chức năng mở rộng
  * Mở rộng dữ liệu thông báo
  * Mở rộng nhà cung cấp thông báo

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsCommonModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Định nghĩa cơ sở

### Nhóm thông báo

```csharp
public class NotificationGroupDefinition
{
    public string Name { get; }
    public string DisplayName { get; }
    public string Description { get; }
    public bool AllowSubscriptionToClients { get; }
}
```

### Định nghĩa thông báo

```csharp
public class NotificationDefinition
{
    public string Name { get; }
    public string DisplayName { get; }
    public string Description { get; }
    public NotificationType NotificationType { get; }
    public NotificationLifetime Lifetime { get; }
    public bool AllowSubscriptionToClients { get; }
}
```

## Cách dùng cơ bản

1. Định nghĩa nhóm thông báo
```csharp
public class YourNotificationGroupDefinitionProvider : NotificationGroupDefinitionProvider
{
    public override void Define(INotificationGroupDefinitionContext context)
    {
        context.Add(
            new NotificationGroupDefinition(
                name: "App.Notifications",
                displayName: L("AppNotifications"),
                description: L("AppNotificationsDescription")
            )
        );
    }
}
```

2. Định nghĩa thông báo
```csharp
public class YourNotificationDefinitionProvider : NotificationDefinitionProvider
{
    public override void Define(INotificationDefinitionContext context)
    {
        context.Add(
            new NotificationDefinition(
                name: "App.NewMessage",
                displayName: L("NewMessage"),
                description: L("NewMessageDescription"),
                notificationType: NotificationType.Application,
                lifetime: NotificationLifetime.Persistent
            )
        );
    }
}
```

3. Sử dụng mở rộng dữ liệu thông báo
```csharp
public static class NotificationDataExtensions
{
    public static void SetTitle(this NotificationData data, string title)
    {
        data.ExtraProperties["Title"] = title;
    }

    public static string GetTitle(this NotificationData data)
    {
        return data.ExtraProperties.GetOrDefault("Title") as string;
    }
}
```

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu hệ thống thông báo](https://docs.abp.io/en/abp/latest/Notifications)
