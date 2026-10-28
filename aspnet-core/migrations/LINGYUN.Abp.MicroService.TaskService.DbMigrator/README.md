# LINGYUN.Abp.MicroService.TaskService.DbMigrator

Ứng dụng console migration cơ sở dữ liệu quản lý tác vụ, dùng để thực thi migration cơ sở dữ liệu và khởi tạo dữ liệu mẫu (seed data) của hệ thống quản lý tác vụ.

[English](./README.EN.md)

## Tính năng

* Tự động thực thi migration cơ sở dữ liệu
* Khởi tạo dữ liệu mẫu cần thiết của hệ thống
* Hỗ trợ cấu hình bằng tham số dòng lệnh
* Tích hợp container dependency injection Autofac
* Kế thừa toàn bộ chức năng migration của hệ thống quản lý tác vụ

## Phụ thuộc module

```csharp
[DependsOn(
    typeof(TaskManagementMigrationsEntityFrameworkCoreModule),
    typeof(AbpAutofacModule)
)]
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "TaskManagementDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  },
  "IdentityServer": {
    "Clients": {
      "TaskManagement_App": {
        "ClientId": "TaskManagement_App"
      }
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Cấu hình chuỗi kết nối TaskManagementDbMigrator trong appsettings.json

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
