# LINGYUN.Abp.Notifications.HttpApi

Mô-đun HTTP API của hệ thống thông báo, cung cấp giao diện REST API của hệ thống thông báo.

## Tính năng

* API quản lý thông báo
* API đăng ký thông báo
* API quản lý trạng thái thông báo
* Hỗ trợ kiểm soát phiên bản API
* Hỗ trợ tài liệu Swagger

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsHttpApiModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện API

### NotificationController

* GET /api/notifications/{id} - Lấy chi tiết thông báo
* GET /api/notifications - Lấy danh sách thông báo
* DELETE /api/notifications/{id} - Xóa thông báo
* PUT /api/notifications/{id}/read - Đánh dấu thông báo là đã đọc
* PUT /api/notifications/read - Đánh dấu tất cả thông báo là đã đọc

### NotificationSubscriptionController

* POST /api/notifications/subscriptions - Đăng ký thông báo
* DELETE /api/notifications/subscriptions - Hủy đăng ký thông báo
* GET /api/notifications/subscribers - Lấy danh sách người đăng ký có thể phân bổ
* GET /api/notifications/subscriptions - Lấy danh sách thông báo đã đăng ký

## Cách dùng cơ bản

1. Cấu hình Startup
```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplication<YourHttpApiModule>();
    }

    public void Configure(IApplicationBuilder app)
    {
        app.InitializeApplication();
    }
}
```

2. Ví dụ gọi API
```bash
# Lấy danh sách thông báo
curl -X GET "https://localhost:44300/api/notifications"

# Đăng ký thông báo
curl -X POST "https://localhost:44300/api/notifications/subscriptions" \
     -H "Content-Type: application/json" \
     -d '{"notificationName":"YourNotification"}'
```

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu ASP.NET Core](https://docs.microsoft.com/aspnet/core)
