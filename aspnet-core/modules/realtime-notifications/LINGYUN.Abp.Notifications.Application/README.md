# LINGYUN.Abp.Notifications.Application

Mô-đun tầng ứng dụng của hệ thống thông báo, cung cấp triển khai dịch vụ ứng dụng của hệ thống thông báo.

## Tính năng

* Dịch vụ quản lý thông báo
* Dịch vụ đăng ký thông báo
* Dịch vụ phát hành thông báo
* Dịch vụ truy vấn thông báo
* Dịch vụ quản lý trạng thái thông báo

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsApplicationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Dịch vụ ứng dụng

### INotificationAppService

* GetAsync - Lấy chi tiết thông báo
* GetListAsync - Lấy danh sách thông báo
* DeleteAsync - Xóa thông báo
* MarkReadAsync - Đánh dấu thông báo là đã đọc
* MarkAllReadAsync - Đánh dấu tất cả thông báo là đã đọc

### INotificationSubscriptionAppService

* SubscribeAsync - Đăng ký thông báo
* UnSubscribeAsync - Hủy đăng ký thông báo
* GetAssignableSubscribersAsync - Lấy danh sách người đăng ký có thể phân công
* GetSubscribedListAsync - Lấy danh sách thông báo đã đăng ký

## Cách dùng cơ bản

1. Gửi thông báo
```csharp
await NotificationAppService.PublishAsync(
    name: "YourNotification",
    data: new NotificationData(),
    userIds: new[] { CurrentUser.Id });
```

2. Quản lý đăng ký thông báo
```csharp
await NotificationSubscriptionAppService.SubscribeAsync(
    notificationName: "YourNotification");
```

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
