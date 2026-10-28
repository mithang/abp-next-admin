# LINGYUN.Abp.Elsa.Activities.Notifications

Mô-đun tích hợp hoạt động thông báo của quy trình làm việc Elsa

## Tính năng

* Cung cấp hoạt động **SendNotification** để gửi thông báo
  * Hỗ trợ gửi tới nhiều người dùng
  * Hỗ trợ dữ liệu thông báo và nội dung mẫu
  * Hỗ trợ cú pháp JavaScript và Liquid
  * Hỗ trợ đặt mức độ nghiêm trọng của thông báo
  * Tích hợp giao diện `INotificationSender` của khung ABP
  * Hỗ trợ đa tenant

## Cấu hình sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaActivitiesNotificationsModule)
    )]
public class YouProjectModule : AbpModule
{
}
```

## appsettings.json

```json
{
    "Elsa": {
        "Notification": true    // Bật hoạt động thông báo
    }
}
```

## Tham số hoạt động

* **NotificationName**: Tên thông báo đã đăng ký
* **NotificationData**: Dữ liệu thông báo hoặc nội dung mẫu
* **To**: Danh sách ID người dùng nhận
* **Severity**: Mức độ nghiêm trọng của thông báo (mặc định là Info)

## Tham số đầu ra

* **NotificationId**: ID của thông báo đã gửi

[English](./README.EN.md)
