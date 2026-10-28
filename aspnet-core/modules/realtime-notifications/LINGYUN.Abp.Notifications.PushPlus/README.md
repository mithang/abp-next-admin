# LINGYUN.Abp.Notifications.PushPlus

Triển khai PushPlus của mô-đun thông báo  

Cho phép ứng dụng phát hành thông báo thời gian thực qua PushPlus  

## Tính năng

* Hỗ trợ nhiều loại thông điệp
  * Thông điệp văn bản
  * Thông điệp HTML
  * Thông điệp Markdown
  * Thông điệp hình ảnh
  * Thông điệp mẫu tùy chỉnh
* Hỗ trợ gọi lại thông điệp
  * Hỗ trợ URL gọi lại tùy chỉnh
  * Hỗ trợ gọi lại trạng thái gửi thông điệp
* Hỗ trợ đẩy qua nhiều kênh
  * Tài khoản công khai WeChat
  * WeChat Doanh nghiệp
  * Email
  * SMS
  * WebHook
* Hỗ trợ thông điệp nhóm
  * Hỗ trợ đẩy nhóm
  * Hỗ trợ quản lý nhóm

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsPushPlusModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "PushPlus": {
    "Token": "Token PushPlus của bạn",
    "DefaultChannel": "wechat",          // Kênh đẩy mặc định: wechat/webhook/mail/sms
    "DefaultTemplate": "html",           // Mẫu thông điệp mặc định: html/json/markdown/txt
    "DefaultWebhook": "",               // Địa chỉ Webhook mặc định
    "DefaultCallbackUrl": ""            // Địa chỉ gọi lại mặc định
  }
}
```

## Cách dùng cơ bản

1. Cấu hình dịch vụ PushPlus
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<AbpNotificationsPushPlusOptions>(options =>
    {
        options.Token = "Token PushPlus của bạn";
        options.DefaultChannel = "wechat";
        options.DefaultTemplate = "html";
    });
}
```

2. Gửi thông báo
```csharp
public class YourService
{
    private readonly INotificationSender _notificationSender;

    public YourService(INotificationSender notificationSender)
    {
        _notificationSender = notificationSender;
    }

    public async Task SendNotificationAsync()
    {
        var notificationData = new NotificationData();
        notificationData.TrySetData("title", "Tiêu đề thông điệp");
        notificationData.TrySetData("content", "Nội dung thông điệp");
        notificationData.SetWebhook("https://your-webhook.com");
        notificationData.SetCallbackUrl("https://your-callback.com");

        await _notificationSender.SendNofiterAsync(
            "YourNotification",
            notificationData,
            userIds: new[] { CurrentUser.Id }
        );
    }
}
```

## Lưu ý

1. Trước khi sử dụng, cần đăng ký trên nền tảng PushPlus và lấy Token.
2. Đảm bảo Token đã cấu hình hợp lệ và có đủ quyền.
3. URL gọi lại phải là địa chỉ có thể truy cập công khai trên Internet.
4. Các kênh khác nhau có thể có yêu cầu định dạng thông điệp khác nhau.
5. Việc gửi thông điệp phụ thuộc vào PushPlus API, cần đảm bảo kết nối mạng bình thường.

## Thông tin thêm

* [Tài liệu chính thức của PushPlus](http://www.pushplus.plus/doc/)
* [Tài liệu ABP](https://docs.abp.io)
