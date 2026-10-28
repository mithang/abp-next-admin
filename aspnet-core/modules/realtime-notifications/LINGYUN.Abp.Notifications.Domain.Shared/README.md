# LINGYUN.Abp.Notifications.Domain.Shared

Mô-đun tầng lĩnh vực chia sẻ của hệ thống thông báo, cung cấp hằng số chia sẻ, enum và các đối tượng lĩnh vực khác của hệ thống thông báo.

## Tính năng

* Định nghĩa loại thông báo
* Định nghĩa mức độ nghiêm trọng của thông báo
* Định nghĩa trạng thái thông báo
* Định nghĩa vòng đời thông báo
* Định nghĩa hằng số thông báo

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsDomainSharedModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Định nghĩa enum

### NotificationType

* Application - Thông báo ứng dụng
* System - Thông báo hệ thống
* User - Thông báo người dùng

### NotificationSeverity

* Info - Thông tin
* Success - Thành công
* Warn - Cảnh báo
* Error - Lỗi
* Fatal - Lỗi nghiêm trọng

### NotificationLifetime

* Persistent - Thông báo bền vững
* OnlyOne - Thông báo một lần

## Cách dùng cơ bản

1. Dùng loại thông báo
```csharp
var notificationType = NotificationType.Application;
```

2. Dùng mức độ nghiêm trọng của thông báo
```csharp
var severity = NotificationSeverity.Info;
```

## Thêm thông tin

* [Tài liệu ABP](https://docs.abp.io)
