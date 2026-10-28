# LY.MicroService.Platform.DbMigrator

Ứng dụng console di chuyển cơ sở dữ liệu quản lý nền tảng, dùng để thực thi di chuyển cơ sở dữ liệu và khởi tạo dữ liệu seed cho hệ thống quản lý nền tảng.

[English](./README.EN.md)

## Tính năng

* Tự động thực thi di chuyển cơ sở dữ liệu
* Khởi tạo dữ liệu seed cần thiết cho hệ thống
* Hỗ trợ cấu hình bằng tham số dòng lệnh
* Tích hợp bộ chứa dependency injection Autofac
* Kế thừa toàn bộ chức năng di chuyển của hệ thống quản lý nền tảng
* Hỗ trợ quản lý từ điển dữ liệu
* Hỗ trợ quản lý tổ chức
* Hỗ trợ quản lý menu
* Hỗ trợ quản lý phiên bản
* Hỗ trợ điều hướng Vue Vben Admin UI

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(PlatformMigrationsEntityFrameworkCoreModule),
    typeof(AbpAutofacModule)
)]
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "PlatformDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Cấu hình chuỗi kết nối PlatformDbMigrator trong appsettings.json

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

* Từ điển dữ liệu mặc định
* Tổ chức cơ sở
* Menu hệ thống
* Cấu hình phiên bản mặc định
* Cấu hình điều hướng UI

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu Vue Vben Admin](https://doc.vvbin.cn/)
