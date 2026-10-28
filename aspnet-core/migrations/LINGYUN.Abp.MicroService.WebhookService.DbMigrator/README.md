# LINGYUN.Abp.MicroService.WebhookService.DbMigrator

Ứng dụng console migration cơ sở dữ liệu quản lý Webhooks, dùng để thực thi migration cơ sở dữ liệu và khởi tạo dữ liệu mẫu (seed data) của hệ thống quản lý Webhooks.

[English](./README.EN.md)

## Tính năng

* Tự động thực thi migration cơ sở dữ liệu
* Khởi tạo dữ liệu mẫu cần thiết của hệ thống
* Hỗ trợ cấu hình bằng tham số dòng lệnh
* Tích hợp container dependency injection Autofac
* Kế thừa toàn bộ chức năng migration của hệ thống quản lý Webhooks

## Phụ thuộc module

```csharp
[DependsOn(
    typeof(WebhooksManagementMigrationsEntityFrameworkCoreModule),
    typeof(AbpAutofacModule)
)]
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "WebhooksManagementDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  },
  "IdentityServer": {
    "Clients": {
      "WebhooksManagement_App": {
        "ClientId": "WebhooksManagement_App"
      }
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Cấu hình chuỗi kết nối WebhooksManagementDbMigrator trong appsettings.json

2. Chạy chương trình migration
   ```bash
   dotnet run
   ```

## Tham số dòng lệnh

* --database-provider
  * Chỉ định database provider (mặc định: MySQL)
* --connection-string
  * Chỉ định chuỗi kết nối cơ sở dữ liệu
* --skip-db-migrations
  * Bỏ qua migration cơ sở dữ liệu
* --skip-seed-data
  * Bỏ qua khởi tạo dữ liệu mẫu

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu migration EF Core](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/)
