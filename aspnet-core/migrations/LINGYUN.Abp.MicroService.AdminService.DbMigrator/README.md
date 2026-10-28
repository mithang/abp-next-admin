# LINGYUN.Abp.MicroService.AdminService.DbMigrator

Ứng dụng console di chuyển cơ sở dữ liệu hệ thống quản trị nền tảng, dùng để thực thi việc di chuyển cơ sở dữ liệu và khởi tạo dữ liệu seed của hệ thống quản trị nền tảng.

[English](./README.EN.md)

## Tính năng

* Tự động thực thi di chuyển cơ sở dữ liệu
* Khởi tạo dữ liệu seed cần thiết cho hệ thống
* Hỗ trợ cấu hình tham số dòng lệnh
* Tích hợp container dependency injection Autofac
* Tích hợp quản lý tính năng
* Tích hợp quản lý cài đặt
* Tích hợp quản lý quyền
* Tích hợp quản lý bản địa hóa
* Tích hợp quản lý bộ nhớ đệm
* Tích hợp nhật ký kiểm toán
* Tích hợp mẫu văn bản
* Tích hợp xác thực danh tính
* Tích hợp IdentityServer
* Tích hợp OpenIddict
* Tích hợp quản lý nền tảng
* Tích hợp lưu trữ đối tượng
* Tích hợp hệ thống thông báo
* Tích hợp dịch vụ tin nhắn
* Tích hợp quản lý tác vụ
* Tích hợp quản lý Webhooks

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(BackendAdminMigrationsEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementApplicationContractsModule),
    typeof(AbpSettingManagementApplicationContractsModule),
    typeof(AbpPermissionManagementApplicationContractsModule),
    typeof(AbpLocalizationManagementApplicationContractsModule),
    typeof(AbpCachingManagementApplicationContractsModule),
    typeof(AbpAuditingApplicationContractsModule),
    typeof(AbpTextTemplatingApplicationContractsModule),
    typeof(AbpIdentityApplicationContractsModule),
    typeof(AbpIdentityServerApplicationContractsModule),
    typeof(AbpOpenIddictApplicationContractsModule),
    typeof(PlatformApplicationContractModule),
    typeof(AbpOssManagementApplicationContractsModule),
    typeof(AbpNotificationsApplicationContractsModule),
    typeof(AbpMessageServiceApplicationContractsModule),
    typeof(TaskManagementApplicationContractsModule),
    typeof(WebhooksManagementApplicationContractsModule),
    typeof(AbpAutofacModule)
)]
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "BackendAdminDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  },
  "IdentityServer": {
    "Clients": {
      "BackendAdmin_App": {
        "ClientId": "BackendAdmin_App"
      }
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Trong appsettings.json, cấu hình chuỗi kết nối BackendAdminDbMigrator

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

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu migration EF Core](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/)
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io)
* [Tài liệu OpenIddict](https://documentation.openiddict.com)
