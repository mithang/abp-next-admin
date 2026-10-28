# LINGYUN.Abp.MicroService.AdminService.EntityFrameworkCore

Mô-đun di chuyển dữ liệu quản trị hệ thống, cung cấp chức năng di chuyển cơ sở dữ liệu liên quan đến hệ thống quản trị.

[English](./README.EN.md)

## Tính năng

* Tích hợp di chuyển dữ liệu đa thuê bao SaaS
* Tích hợp di chuyển dữ liệu quản lý cài đặt
* Tích hợp di chuyển dữ liệu quản lý bảo vệ dữ liệu
* Tích hợp di chuyển dữ liệu quản lý quyền
* Tích hợp di chuyển dữ liệu quản lý tính năng
* Tích hợp di chuyển dữ liệu mẫu văn bản
* Hỗ trợ cơ sở dữ liệu MySQL

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpDataProtectionManagementEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpTextTemplatingEntityFrameworkCoreModule),
    typeof(AbpDataDbMigratorModule)
)]
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "BackendAdminDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Cấu hình chuỗi kết nối BackendAdminDbMigrator trong appsettings.json

2. Thêm phụ thuộc mô-đun
   ```csharp
   [DependsOn(typeof(BackendAdminMigrationsEntityFrameworkCoreModule))]
   public class YourModule : AbpModule
   {
       // ...
   }
   ```

## Mô tả bảng cơ sở dữ liệu

* Bảng liên quan đến Saas - dữ liệu đa thuê bao như thuê bao, phiên bản
* AbpSettings - dữ liệu cài đặt hệ thống
* AbpDataProtection - dữ liệu liên quan đến bảo vệ dữ liệu
* AbpPermissionGrants - dữ liệu cấp quyền
* AbpFeatures - dữ liệu tính năng
* AbpTextTemplates - dữ liệu mẫu văn bản

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Bảo vệ dữ liệu ASP.NET Core](https://docs.microsoft.com/zh-cn/aspnet/core/security/data-protection/introduction)
