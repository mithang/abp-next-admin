# LINGYUN.Abp.Notifications.WeChat.Work

Mô-đun phát hành thông báo WeChat Doanh nghiệp, cung cấp chức năng gửi tin nhắn tới người dùng qua ứng dụng WeChat Doanh nghiệp.

## Tính năng

* Hỗ trợ nhiều loại tin nhắn
  * Tin nhắn văn bản
  * Tin nhắn thẻ văn bản
  * Tin nhắn Markdown
* Mục tiêu gửi tin nhắn linh hoạt
  * Hỗ trợ gửi tới người dùng chỉ định
  * Hỗ trợ gửi tới phòng ban chỉ định
  * Hỗ trợ gửi tới thẻ chỉ định
  * Hỗ trợ gửi tới nhiều ứng dụng
* Hỗ trợ đa ngôn ngữ
  * Hỗ trợ nội dung tin nhắn bản địa hóa
  * Hỗ trợ tiêu đề và mô tả đa ngôn ngữ
* Điều khiển bằng công tắc tính năng
  * Hỗ trợ điều khiển việc gửi tin nhắn qua công tắc tính năng
* Khả năng mở rộng
  * Hỗ trợ định nghĩa thông báo tùy chỉnh
  * Hỗ trợ xử lý tin nhắn tùy chỉnh

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsWeChatWorkModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Hướng dẫn cấu hình

### 1. Cấu hình cơ bản

Việc gửi tin nhắn cần cấu hình ứng dụng trong hệ thống quản trị WeChat Doanh nghiệp và lấy ID ứng dụng tương ứng (AgentId).

### 2. Cấu hình định nghĩa thông báo

```csharp
public class YourNotificationDefinitionProvider : NotificationDefinitionProvider
{
    public override void Define(INotificationDefinitionContext context)
    {
        var notification = context.Create(
            name: "App.Notification.Test",
            displayName: L("TestNotification"))
            .WithAgentId("1000001")               // Đặt ID ứng dụng
            .WithParty("1|2|3")                   // Đặt phòng ban nhận
            .WithTag("TagId1|TagId2")             // Đặt thẻ nhận
            .WithAllAgent();                      // Gửi tới tất cả ứng dụng
    }
}
```

### 3. Gửi thông báo

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
        
        // Đặt nội dung tin nhắn
        notificationData.TrySetData("title", "Tiêu đề tin nhắn");
        notificationData.TrySetData("message", "Nội dung tin nhắn");
        notificationData.TrySetData("description", "Mô tả tin nhắn");

        // Đặt mục tiêu gửi
        notificationData.SetAgentId("1000001");   // Đặt ID ứng dụng
        notificationData.SetParty("1|2|3");       // Đặt phòng ban nhận
        notificationData.SetTag("TagId1|TagId2"); // Đặt thẻ nhận
        notificationData.WithAllAgent();          // Gửi tới tất cả ứng dụng

        await _notificationPublisher.PublishAsync(
            "App.Notification.Test",              // Tên thông báo
            notificationData,                     // Dữ liệu thông báo
            userIds: new[] { "userId" },          // Danh sách ID người dùng nhận
            tenantIds: new[] { "tenantId" }       // Danh sách ID tenant
        );
    }
}
```

## Lưu ý

1. Khi gửi tin nhắn cần đảm bảo ứng dụng WeChat Doanh nghiệp được cấu hình đúng, bao gồm ID ứng dụng và các quyền liên quan.
2. ID phòng ban và ID thẻ cần khớp với cấu hình trong hệ thống quản trị WeChat Doanh nghiệp.
3. Nhiều người nhận (phòng ban/thẻ) dùng '|' để phân tách, hỗ trợ tối đa 100 người nhận.
4. Khi dùng `WithAllAgent()` sẽ gửi tin nhắn tới tất cả ứng dụng đã cấu hình.
5. Việc gửi tin nhắn phụ thuộc vào API WeChat Doanh nghiệp, cần đảm bảo kết nối mạng bình thường.

## Tài liệu khác

* [English Documentation](README.EN.md)
* [Tài liệu phát triển tin nhắn ứng dụng WeChat Doanh nghiệp](https://developer.work.weixin.qq.com/document/path/90236)
