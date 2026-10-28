# LINGYUN.Abp.MicroService.LocalizationService.EntityFrameworkCore

Mô-đun di chuyển dữ liệu quản lý bản địa hóa, cung cấp chức năng di chuyển cơ sở dữ liệu liên quan đến hệ thống quản lý bản địa hóa.

[English](./README.EN.md)

## Tính năng

* Tích hợp di chuyển dữ liệu đa tenant SaaS
* Tích hợp di chuyển dữ liệu quản lý bản địa hóa
* Tích hợp di chuyển dữ liệu quản lý cài đặt
* Tích hợp di chuyển dữ liệu quản lý quyền
* Tích hợp di chuyển dữ liệu quản lý tính năng
* Hỗ trợ cơ sở dữ liệu MySQL

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(AbpLocalizationManagementEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpDataDbMigratorModule)
)]
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "LocalizationManagementDbMigrator": "chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Trong appsettings.json, cấu hình chuỗi kết nối LocalizationManagementDbMigrator

2. Thêm phụ thuộc mô-đun
   ```csharp
   [DependsOn(typeof(LocalizationManagementMigrationsEntityFrameworkCoreModule))]
   public class YourModule : AbpModule
   {
       // ...
   }
   ```

## Mô tả bảng cơ sở dữ liệu

* AbpLocalization - Tài nguyên bản địa hóa và dữ liệu văn bản
* Các bảng liên quan đến Saas - Dữ liệu đa tenant như tenant, phiên bản
* AbpSettings - Dữ liệu cài đặt hệ thống
* AbpPermissionGrants - Dữ liệu cấp quyền
* AbpFeatures - Dữ liệu tính năng

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu bản địa hóa ABP](https://docs.abp.io/zh-Hans/abp/latest/Localization)
