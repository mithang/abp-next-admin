# LINGYUN.Abp.Notifications.Core

Mô-đun lõi của hệ thống thông báo, cung cấp chức năng và định nghĩa cơ bản của hệ thống thông báo.

## Tính năng

* Quản lý định nghĩa thông báo
* Quản lý định nghĩa nhóm thông báo
* Cơ chế nhà cung cấp thông báo có thể mở rộng
* Hỗ trợ nhà cung cấp định nghĩa thông báo tùy chỉnh

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsCoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "Notifications": {
    "DeletedNotifications": [], // Danh sách định nghĩa thông báo cần xóa
    "DeletedNotificationGroups": [] // Danh sách định nghĩa nhóm thông báo cần xóa
  }
}
```

## Cách dùng cơ bản

1. Triển khai nhà cung cấp định nghĩa thông báo tùy chỉnh
```csharp
public class YourNotificationDefinitionProvider : NotificationDefinitionProvider
{
    public override void Define(INotificationDefinitionContext context)
    {
        // Định nghĩa thông báo
        context.Add(
            new NotificationDefinition(
                name: "YourNotification",
                displayName: L("YourNotification"),
                description: L("YourNotificationDescription"),
                notificationType: NotificationType.Application,
                lifetime: NotificationLifetime.Persistent,
                allowSubscriptionToClients: true)
        );
    }
}
```

2. Đăng ký nhà cung cấp định nghĩa thông báo
```csharp
Configure<AbpNotificationsOptions>(options =>
{
    options.DefinitionProviders.Add<YourNotificationDefinitionProvider>();
});
```

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
