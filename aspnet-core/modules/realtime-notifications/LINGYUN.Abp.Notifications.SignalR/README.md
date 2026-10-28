# LINGYUN.Abp.Notifications.SignalR

Module SignalR của hệ thống thông báo, cung cấp chức năng thông báo thời gian thực dựa trên SignalR.

## Tính năng

* Đẩy thông báo thời gian thực
* Triển khai Hub thông báo
* Quản lý kết nối máy khách
* Hỗ trợ thông báo theo nhóm
* Hỗ trợ quản lý trạng thái trực tuyến của người dùng

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpNotificationsSignalRModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Các mục cấu hình

```json
{
  "SignalR": {
    "HubUrl": "/signalr-hubs/notifications",
    "UseMessagePack": false
  }
}
```

## Định nghĩa Hub

### NotificationHub

* SubscribeToNotifications - Đăng ký nhận thông báo
* UnsubscribeFromNotifications - Hủy đăng ký nhận thông báo
* GetNotifications - Lấy danh sách thông báo
* MarkNotificationAsRead - Đánh dấu thông báo là đã đọc
* MarkAllNotificationsAsRead - Đánh dấu mọi thông báo là đã đọc

## Cách dùng cơ bản

1. Cấu hình phía máy chủ
```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSignalR()
                .AddMessagePackProtocol(); // Tùy chọn, dùng giao thức MessagePack
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHub<NotificationHub>("/signalr-hubs/notifications");
        });
    }
}
```

2. Sử dụng phía máy khách
```javascript
// Kết nối tới Hub thông báo
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/signalr-hubs/notifications")
    .build();

// Lắng nghe thông báo
connection.on("ReceiveNotification", (notification) => {
    console.log("Đã nhận thông báo mới:", notification);
});

// Khởi động kết nối
await connection.start();

// Đăng ký nhận thông báo
await connection.invoke("SubscribeToNotifications");
```

## Thêm thông tin

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu SignalR](https://docs.microsoft.com/aspnet/core/signalr)
