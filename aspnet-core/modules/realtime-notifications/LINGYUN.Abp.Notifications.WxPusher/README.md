# LINGYUN.Abp.Notifications.WxPusher

Module thông báo ABP triển khai qua WxPusher, cung cấp chức năng gửi thông báo thời gian thực qua WxPusher.

[English](./README.EN.md)

## Tính năng

* Hỗ trợ nhiều loại thông điệp
  * Thông điệp văn bản
  * Thông điệp HTML
  * Thông điệp Markdown
* Đích gửi thông điệp linh hoạt
  * Hỗ trợ gửi đến người dùng chỉ định
  * Hỗ trợ gửi đến Topic chỉ định
* Hỗ trợ đa ngôn ngữ
  * Hỗ trợ nội dung thông điệp đã bản địa hóa
  * Hỗ trợ tiêu đề và mô tả đa ngôn ngữ
* Điều khiển bằng công tắc tính năng
  * Hỗ trợ điều khiển việc gửi thông điệp qua công tắc tính năng

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Notifications.WxPusher
```

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpNotificationsWxPusherModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

## Hướng dẫn cấu hình

### 1. Cấu hình định nghĩa thông báo

```csharp
public class YourNotificationDefinitionProvider : NotificationDefinitionProvider
{
    public override void Define(INotificationDefinitionContext context)
    {
        var notification = context.Create(
            name: "App.Notification.Test",
            displayName: L("TestNotification"))
            .WithContentType(MessageContentType.Text)  // Đặt loại thông điệp
            .WithTopics(new List<int> { 1, 2 })       // Đặt Topic của thông điệp
            .WithUrl("https://example.com");          // Đặt URL chuyển hướng khi bấm vào thông điệp
    }
}
```

### 2. Gửi thông báo

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
        var notificationData = new NotificationData();
        
        // Đặt nội dung thông điệp
        notificationData.TrySetData("title", "Tiêu đề thông điệp");
        notificationData.TrySetData("message", "Nội dung thông điệp");
        notificationData.SetUrl("https://example.com");  // Đặt URL chuyển hướng khi bấm vào thông điệp

        await _notificationPublisher.PublishAsync(
            "App.Notification.Test",              // Tên thông báo
            notificationData,                     // Dữ liệu thông báo
            userIds: new[] { "userId" },          // Danh sách ID người nhận
            tenantIds: new[] { "tenantId" }       // Danh sách ID tenant
        );
    }
}
```

## Lưu ý

1. Cần triển khai giao diện `IWxPusherUserStore` để quản lý quan hệ liên kết giữa người dùng và WxPusher.
2. Việc gửi thông điệp phụ thuộc vào API WxPusher, cần đảm bảo kết nối mạng bình thường.
3. Hãy đặt độ dài nội dung thông điệp hợp lý, tránh vượt quá giới hạn của WxPusher.
4. Khi dùng chức năng đa ngôn ngữ, cần đảm bảo đã cấu hình đúng tài nguyên bản địa hóa.

## Vị trí mã nguồn

[LINGYUN.Abp.Notifications.WxPusher](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/modules/realtime-notifications/LINGYUN.Abp.Notifications.WxPusher)
