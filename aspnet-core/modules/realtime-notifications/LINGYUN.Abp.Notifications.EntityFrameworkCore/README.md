# LINGYUN.Abp.Notifications.EntityFrameworkCore

Mô-đun EntityFrameworkCore của hệ thống thông báo, cung cấp triển khai truy cập dữ liệu của hệ thống thông báo.

## Tính năng

* Cấu hình ánh xạ thực thể thông báo
* Triển khai kho lưu trữ thông báo
* Triển khai kho lưu trữ đăng ký thông báo
* Hỗ trợ nhiều cơ sở dữ liệu
* Hỗ trợ mở rộng kho lưu trữ tùy chỉnh

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpNotificationsEntityFrameworkCoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Ánh xạ thực thể

### NotificationEfCoreEntityTypeConfiguration

* Notification - Ánh xạ thực thể thông báo
  * Id - Ánh xạ khóa chính
  * NotificationName - Ánh xạ tên thông báo
  * Data - Ánh xạ dữ liệu thông báo
  * CreationTime - Ánh xạ thời gian tạo
  * Type - Ánh xạ loại thông báo
  * Severity - Ánh xạ mức độ nghiêm trọng của thông báo

### NotificationSubscriptionEfCoreEntityTypeConfiguration

* NotificationSubscription - Ánh xạ thực thể đăng ký thông báo
  * UserId - Ánh xạ định danh người dùng
  * NotificationName - Ánh xạ tên thông báo
  * CreationTime - Ánh xạ thời gian tạo

## Cách dùng cơ bản

1. Cấu hình DbContext
```csharp
public class YourDbContext : AbpDbContext<YourDbContext>
{
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<NotificationSubscription> NotificationSubscriptions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ConfigureNotifications();
    }
}
```

2. Cấu hình chuỗi kết nối
```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=YourDb;Trusted_Connection=True"
  }
}
```

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu Entity Framework Core](https://docs.microsoft.com/ef/core/)
