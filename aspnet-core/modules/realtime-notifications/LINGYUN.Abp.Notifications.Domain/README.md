# LINGYUN.Abp.Notifications.Domain

Mô-đun tầng lĩnh vực của hệ thống thông báo, cung cấp mô hình lĩnh vực và logic nghiệp vụ của hệ thống thông báo.

## Tính năng

* Định nghĩa thực thể thông báo
* Quản lý đăng ký thông báo
* Quản lý trạng thái thông báo
* Hỗ trợ mở rộng dữ liệu thông báo
* Hỗ trợ dữ liệu thông báo tùy chỉnh

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsDomainModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mô hình lĩnh vực

### Notification

* Id - Định danh duy nhất của thông báo
* Name - Tên thông báo
* NotificationData - Dữ liệu thông báo
* CreationTime - Thời gian tạo
* Type - Loại thông báo
* Severity - Mức độ nghiêm trọng của thông báo
* ExtraProperties - Thuộc tính mở rộng

### NotificationSubscription

* UserId - Định danh người dùng
* NotificationName - Tên thông báo
* CreationTime - Thời gian tạo

## Cách dùng cơ bản

1. Tạo thông báo
```csharp
var notification = new Notification(
    id: GuidGenerator.Create(),
    name: "YourNotification",
    data: new NotificationData(),
    tenantId: CurrentTenant.Id);
```

2. Quản lý đăng ký thông báo
```csharp
await NotificationSubscriptionManager.SubscribeAsync(
    userId: CurrentUser.Id,
    notificationName: "YourNotification");
```

## Thêm thông tin

* [Tài liệu ABP](https://docs.abp.io)
