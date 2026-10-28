# LINGYUN.Abp.MicroService.LocalizationService.DbMigrator

Ứng dụng console di chuyển cơ sở dữ liệu quản lý bản địa hóa, dùng để thực hiện di chuyển cơ sở dữ liệu và khởi tạo dữ liệu seed của hệ thống quản lý bản địa hóa.

[English](./README.EN.md)

## Tính năng

* Tự động thực hiện di chuyển cơ sở dữ liệu
* Khởi tạo dữ liệu seed cần thiết của hệ thống
* Hỗ trợ cấu hình tham số dòng lệnh
* Tích hợp container dependency injection Autofac
* Kế thừa tất cả chức năng di chuyển của hệ thống quản lý bản địa hóa
* Hỗ trợ quản lý tài nguyên đa ngôn ngữ
* Hỗ trợ quản lý văn bản ngôn ngữ động
* Hỗ trợ quản lý ngôn ngữ

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(LocalizationManagementMigrationsEntityFrameworkCoreModule),
    typeof(AbpAutofacModule)
)]
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "LocalizationManagementDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Trong appsettings.json, cấu hình chuỗi kết nối LocalizationManagementDbMigrator

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

* Cấu hình ngôn ngữ mặc định
* Tài nguyên bản địa hóa cơ sở
* Tài nguyên văn bản hệ thống
* Cấu hình quyền mặc định

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu bản địa hóa ABP](https://docs.abp.io/zh-Hans/abp/latest/Localization)
