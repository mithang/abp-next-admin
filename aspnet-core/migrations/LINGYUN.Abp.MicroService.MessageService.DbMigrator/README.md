# LINGYUN.Abp.MicroService.MessageService.DbMigrator

Ứng dụng console di chuyển cơ sở dữ liệu tin nhắn thời gian thực, dùng để thực thi di chuyển cơ sở dữ liệu và khởi tạo dữ liệu seed của hệ thống tin nhắn thời gian thực.

[English](./README.EN.md)

## Tính năng

* Tự động thực thi di chuyển cơ sở dữ liệu
* Khởi tạo dữ liệu seed cần thiết cho hệ thống
* Hỗ trợ cấu hình tham số dòng lệnh
* Tích hợp bộ chứa dependency injection Autofac
* Kế thừa toàn bộ chức năng di chuyển của hệ thống tin nhắn thời gian thực
* Hỗ trợ quản lý tin nhắn SignalR
* Hỗ trợ quản lý nhóm tin nhắn
* Hỗ trợ quản lý đăng ký tin nhắn
* Hỗ trợ lịch sử tin nhắn

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(RealtimeMessageMigrationsEntityFrameworkCoreModule),
    typeof(AbpAutofacModule)
)]
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "RealtimeMessageDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Trong appsettings.json, cấu hình chuỗi kết nối RealtimeMessageDbMigrator

2. Chạy chương trình di chuyển
   ```bash
   dotnet run
   ```

## Tham số dòng lệnh

* --database-provider
  * Chỉ định nhà cung cấp cơ sở dữ liệu (mặc định: MySQL)
* --connection-string
  * Chỉ định chuỗi kết nối cơ sở dữ liệu
* --skip-db-migrations
  * Bỏ qua di chuyển cơ sở dữ liệu
* --skip-seed-data
  * Bỏ qua khởi tạo dữ liệu seed

## Dữ liệu seed

* Cấu hình nhóm tin nhắn mặc định
* Cấu hình đăng ký tin nhắn cơ bản
* Mẫu tin nhắn hệ thống
* Cấu hình quyền mặc định

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu SignalR](https://docs.microsoft.com/aspnet/core/signalr/introduction)
