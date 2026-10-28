# LINGYUN.Abp.Notifications.Application.Contracts

Mô-đun hợp đồng tầng ứng dụng của hệ thống thông báo, cung cấp định nghĩa giao diện dịch vụ ứng dụng và đối tượng truyền dữ liệu của hệ thống thông báo.

## Tính năng

* Định nghĩa giao diện dịch vụ ứng dụng thông báo
* Định nghĩa giao diện dịch vụ ứng dụng đăng ký thông báo
* Định nghĩa đối tượng truyền dữ liệu (DTO) thông báo
* Định nghĩa quyền thông báo

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện dịch vụ ứng dụng

### INotificationAppService

* GetAsync - Lấy chi tiết thông báo
* GetListAsync - Lấy danh sách thông báo
* DeleteAsync - Xóa thông báo
* MarkReadAsync - Đánh dấu thông báo là đã đọc
* MarkAllReadAsync - Đánh dấu tất cả thông báo là đã đọc

### INotificationSubscriptionAppService

* SubscribeAsync - Đăng ký thông báo
* UnSubscribeAsync - Hủy đăng ký thông báo
* GetAssignableSubscribersAsync - Lấy danh sách người đăng ký có thể gán
* GetSubscribedListAsync - Lấy danh sách thông báo đã đăng ký

## Đối tượng truyền dữ liệu

### NotificationInfo

* Id - Định danh duy nhất của thông báo
* NotificationName - Tên thông báo
* Data - Dữ liệu thông báo
* CreationTime - Thời gian tạo
* Type - Loại thông báo
* Severity - Mức độ nghiêm trọng của thông báo

### NotificationSubscriptionInfo

* NotificationName - Tên thông báo
* DisplayName - Tên hiển thị
* Description - Mô tả
* IsSubscribed - Đã đăng ký hay chưa

## Định nghĩa quyền

* Notifications - Quản lý thông báo
  * Notifications.Manage - Quản lý thông báo
  * Notifications.Delete - Xóa thông báo
  * Notifications.Subscribe - Đăng ký thông báo

## Cách dùng cơ bản

1. Triển khai dịch vụ ứng dụng thông báo
```csharp
public class NotificationAppService : ApplicationService, INotificationAppService
{
    public async Task<NotificationInfo> GetAsync(Guid id)
    {
        // Triển khai logic lấy chi tiết thông báo
    }
}
```

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
