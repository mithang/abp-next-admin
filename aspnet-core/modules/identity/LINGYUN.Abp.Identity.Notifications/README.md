# LINGYUN.Abp.Identity.Notifications

Mô-đun thông báo xác thực danh tính, cung cấp chức năng thông báo liên quan đến xác thực danh tính.

## Tính năng

* Mở rộng mô-đun AbpNotificationsModule
* Cung cấp định nghĩa thông báo liên quan đến xác thực danh tính
* Hỗ trợ thông báo hết hạn phiên
* Cung cấp xử lý sự kiện thu hồi phiên danh tính

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpNotificationsModule),
    typeof(AbpDddDomainSharedModule),
    typeof(AbpIdentityDomainSharedModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Định nghĩa thông báo

### Thông báo phiên

* `AbpIdentity.Session.Expiration` - Thông báo hết hạn phiên
  * Gửi thông báo này khi phiên người dùng hết hạn
  * Thông báo cho người dùng rằng phiên của họ đã hết hạn và cần đăng nhập lại

## Xử lý sự kiện

### IdentitySessionRevokeEventHandler

Xử lý sự kiện thu hồi phiên danh tính, khi phiên bị thu hồi:
* Gửi thông báo hết hạn phiên cho người dùng liên quan
* Thông báo cho người dùng cần đăng nhập lại

## Cách dùng cơ bản

1. Đăng ký thông báo hết hạn phiên
```csharp
public class YourNotificationHandler : INotificationHandler<SessionExpirationNotification>
{
    public async Task HandleNotificationAsync(SessionExpirationNotification notification)
    {
        // Xử lý thông báo hết hạn phiên
    }
}
```

2. Gửi thông báo hết hạn phiên
```csharp
public class YourService
{
    private readonly INotificationSender _notificationSender;

    public YourService(INotificationSender notificationSender)
    {
        _notificationSender = notificationSender;
    }

    public async Task SendSessionExpirationNotificationAsync(Guid userId)
    {
        await _notificationSender.SendAsync(
            IdentityNotificationNames.Session.ExpirationSession,
            new NotificationData(),
            userIds: new[] { userId });
    }
}
```

## Thông tin thêm

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)
* [Tài liệu hệ thống thông báo ABP](https://docs.abp.io/en/abp/latest/Notification-System)
