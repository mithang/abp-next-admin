# LINGYUN.Abp.Notifications.WeChat.MiniProgram

Mô-đun phát hành thông báo Mini Program WeChat, cung cấp chức năng gửi tin nhắn đăng ký cho người dùng qua Mini Program WeChat.

## Tính năng

* Gửi tin nhắn đăng ký của Mini Program WeChat
* Hỗ trợ mẫu tin nhắn tùy chỉnh
* Hỗ trợ tin nhắn đa ngôn ngữ
* Hỗ trợ các môi trường khác nhau (bản phát triển, bản trải nghiệm, bản chính thức)
* Tích hợp hệ thống thông báo ABP

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsWeChatMiniProgramModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

> Lưu ý: mục cấu hình này sẽ bị loại bỏ trong phiên bản lớn liên quan đến WeChat tiếp theo, và được hợp nhất vào LINGYUN.Abp.WeChat.MiniProgram.AbpWeChatMiniProgramOptions

```json
{
  "Notifications": {
    "WeChat": {
      "MiniProgram": {
        "DefaultMsgPrefix": "",           // Dấu đầu tin nhắn mặc định
        "DefaultTemplateId": "",          // ID mẫu Mini Program mặc định
        "DefaultState": "developer",      // Loại Mini Program nhảy đến mặc định: developer (bản phát triển), trial (bản trải nghiệm), formal (bản chính thức)
        "DefaultLanguage": "zh_CN"        // Ngôn ngữ Mini Program mặc định
      }
    }
  }
}
```

## Cách sử dụng

### Gửi thông báo

```csharp
public class YourService
{
    private readonly INotificationPublisher _notificationPublisher;

    public YourService(INotificationPublisher notificationPublisher)
    {
        _notificationPublisher = notificationPublisher;
    }

    public async Task SendNotificationAsync()
    {
        await _notificationPublisher.PublishAsync(
            "WeChatMiniProgram.Notification", // Tên thông báo
            new NotificationData(),           // Dữ liệu thông báo
            userIds: new[] { "userId" },      // Danh sách ID người dùng nhận
            tenantIds: new[] { "tenantId" }   // Danh sách ID tenant
        );
    }
}
```

### Xử lý thông báo tùy chỉnh

```csharp
public class YourNotificationHandler : 
    INotificationHandler<WeChatMiniProgramNotification>
{
    public async Task HandleNotificationAsync(
        WeChatMiniProgramNotification notification)
    {
        // Xử lý thông báo
    }
}
```

## Tài liệu thêm

* [Tài liệu mô-đun phát hành thông báo Mini Program WeChat](README.EN.md)
* [Tài liệu phát triển tin nhắn đăng ký Mini Program WeChat](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)
