# LINGYUN.Abp.Notifications

[English](./README.EN.md) | Tiếng Việt

Mô-đun nền tảng thông báo thời gian thực.

## Tính năng

* Hỗ trợ nhiều loại thông báo (hệ thống, người dùng, ứng dụng, gọi lại dịch vụ)
* Hỗ trợ nhiều vòng đời thông báo (một lần, bền vững)
* Hỗ trợ nhiều loại nội dung thông báo (văn bản, JSON, HTML, Markdown)
* Hỗ trợ nhiều mức độ nghiêm trọng của thông báo (thành công, thông tin, cảnh báo, lỗi, nghiêm trọng)
* Hỗ trợ quản lý đăng ký thông báo
* Hỗ trợ quản lý trạng thái thông báo (đã đọc/chưa đọc)
* Hỗ trợ đa tenant
* Hỗ trợ bản địa hóa
* Hỗ trợ nhà cung cấp thông báo tùy chỉnh

## Phụ thuộc mô-đun

```csharp
[DependsOn(typeof(AbpNotificationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

### 1. Gửi thông báo

```csharp
public class MyService
{
    private readonly INotificationSender _notificationSender;

    public MyService(INotificationSender notificationSender)
    {
        _notificationSender = notificationSender;
    }

    public async Task SendNotificationAsync()
    {
        var data = new NotificationData();
        data.TrySetData("title", "Thông báo thử nghiệm");
        data.TrySetData("message", "Đây là một thông báo thử nghiệm");

        await _notificationSender.SendNofiterAsync(
            "TestNotification",
            data,
            severity: NotificationSeverity.Info);
    }
}
```

### 2. Quản lý đăng ký thông báo

```csharp
public class MyService
{
    private readonly INotificationSubscriptionManager _subscriptionManager;

    public MyService(INotificationSubscriptionManager subscriptionManager)
    {
        _subscriptionManager = subscriptionManager;
    }

    public async Task SubscribeAsync(Guid userId)
    {
        await _subscriptionManager.SubscribeAsync(
            userId,
            "TestNotification");
    }
}
```

## Tùy chọn cấu hình

```json
{
  "Notifications": {
    "PublishProviders": [
      "SignalR"  // Nhà cung cấp thông báo tùy chọn
    ]
  }
}
```

## Loại thông báo

* Application - Thông báo nền tảng
* System - Thông báo hệ thống
* User - Thông báo người dùng
* ServiceCallback - Thông báo gọi lại dịch vụ

## Vòng đời thông báo

* OnlyOne - Thông báo một lần
* Persistent - Thông báo bền vững

## Loại nội dung thông báo

* Text - Văn bản
* Json - JSON
* Html - HTML
* Markdown - Markdown

## Mức độ nghiêm trọng của thông báo

* Success - Thành công
* Info - Thông tin
* Warn - Cảnh báo
* Fatal - Nghiêm trọng
* Error - Lỗi

## Thực hành tốt nhất

1. Chọn loại thông báo và vòng đời phù hợp với nhu cầu thực tế
2. Sử dụng mức độ nghiêm trọng của thông báo một cách hợp lý, tránh lạm dụng mức độ cao
3. Thêm hỗ trợ bản địa hóa phù hợp cho thông báo
4. Định kỳ dọn dẹp dữ liệu thông báo đã hết hạn

## Lưu ý

1. Thông báo bền vững cần triển khai giao diện INotificationStore
2. Nhà cung cấp thông báo tùy chỉnh cần triển khai giao diện INotificationPublishProvider
3. Tên thông báo nên duy nhất và có tính mô tả
4. Cân nhắc việc cách ly dữ liệu trong bối cảnh đa tenant
