# LINGYUN.Abp.Notifications.Emailing

Mô-đun gửi thư của hệ thống thông báo, cung cấp chức năng gửi thông báo qua thư điện tử。

## Tính năng

* Gửi thông báo qua thư điện tử
* Hỗ trợ mẫu thư điện tử
* Hỗ trợ thư điện tử định dạng HTML
* Hỗ trợ nhiều người nhận
* Hỗ trợ gửi CC và BCC

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsEmailingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "Notifications": {
    "Emailing": {
      "Templates": {
        "Default": {
          "Template": "DefaultTemplate",
          "Culture": "zh-Hans"
        }
      }
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình cài đặt thư điện tử
```csharp
Configure<AbpEmailingOptions>(options =>
{
    options.DefaultFromAddress = "noreply@example.com";
    options.DefaultFromDisplayName = "Notification System";
});
```

2. Gửi thông báo qua thư điện tử
```csharp
public class YourNotificationHandler : INotificationHandler
{
    private readonly IEmailSender _emailSender;

    public YourNotificationHandler(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    public async Task HandleAsync(NotificationInfo notification)
    {
        await _emailSender.SendAsync(
            to: notification.UserEmail,
            subject: notification.Title,
            body: notification.Content,
            isBodyHtml: true
        );
    }
}
```

3. Sử dụng mẫu thư điện tử
```csharp
public async Task SendWithTemplateAsync()
{
    var template = await _templateRenderer.RenderAsync(
        "DefaultTemplate",
        new { 
            Title = "Tiêu đề thông báo",
            Content = "Nội dung thông báo"
        }
    );

    await _emailSender.SendAsync(
        to: "user@example.com",
        subject: "Thông báo",
        body: template,
        isBodyHtml: true
    );
}
```

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu gửi thư điện tử](https://docs.abp.io/en/abp/latest/Emailing)
