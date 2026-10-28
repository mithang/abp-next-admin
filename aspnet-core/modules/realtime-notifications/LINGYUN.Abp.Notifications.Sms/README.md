# LINGYUN.Abp.Notifications.Sms

Triển khai SMS của nhà cung cấp phát hành thông báo

Hầu hết các mô-đun được viết lại đều giữ tên trùng với mô-đun chính thức, phân biệt bằng không gian tên, chủ yếu chỉ viết lại một phần nhỏ hoặc bổ sung chức năng bổ sung
Chỉ khi phần lớn mã mô-đun được viết lại, hoặc hoàn toàn là mô-đun mở rộng, mới định nghĩa tên riêng

#### Lưu ý

Phương thức gửi tùy chỉnh có thể thực hiện bằng cách triển khai giao diện ##ISmsNotificationSender## hoặc ghi đè ##SmsNotificationSender##

## Tính năng

* Gửi thông báo SMS
* Hỗ trợ mẫu SMS
* Hỗ trợ nhiều nhà cung cấp dịch vụ SMS
* Hỗ trợ thay thế biến SMS
* Hỗ trợ gửi hàng loạt

## Cấu hình sử dụng

* Mục cấu hình này sẽ bị loại bỏ trong phiên bản lớn liên quan đến SMS tiếp theo

```json

{
  "Notifications": {
    "Sms": {
      "TemplateParamsPrefix": "Tiền tố biến mẫu SMS"
    }
  }
}

```

```csharp
[DependsOn(typeof(AbpNotificationsSmsModule))]
public class YouProjectModule : AbpModule
{
  // other
}

## Cách dùng cơ bản

1. Triển khai giao diện gửi SMS
```csharp
public class YourSmsNotificationSender : SmsNotificationSender
{
    public override async Task SendAsync(NotificationInfo notification)
    {
        var templateParams = GetTemplateParams(notification);
        await SmsService.SendAsync(
            notification.UserPhoneNumber,
            notification.Title,
            templateParams
        );
    }
}
```

2. Đăng ký dịch vụ gửi SMS
```csharp
Configure<AbpNotificationsSmsOptions>(options =>
{
    options.TemplateParamsPrefix = "sms_"; // Tiền tố biến mẫu SMS
});
```

3. Gửi thông báo SMS
```csharp
public class YourService
{
    private readonly INotificationSender _notificationSender;

    public YourService(INotificationSender notificationSender)
    {
        _notificationSender = notificationSender;
    }

    public async Task SendSmsNotificationAsync()
    {
        await _notificationSender.SendNofiterAsync(
            "YourNotification",
            new NotificationData
            {
                // Tham số mẫu SMS
                ["sms_code"] = "123456",
                ["sms_time"] = "5"
            },
            userIds: new[] { CurrentUser.Id }
        );
    }
}
```

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu dịch vụ SMS](https://docs.abp.io/en/abp/latest/SMS-Sending)
