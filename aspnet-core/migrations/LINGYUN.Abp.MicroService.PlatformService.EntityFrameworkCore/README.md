# LY.MicroService.Platform.EntityFrameworkCore

Mô-đun di chuyển dữ liệu quản trị nền tảng, cung cấp chức năng di chuyển cơ sở dữ liệu liên quan đến hệ thống quản trị nền tảng.

[English](./README.EN.md)

## Tính năng

* Tích hợp di chuyển dữ liệu đa thuê bao SaaS
* Tích hợp di chuyển dữ liệu quản trị nền tảng
* Tích hợp di chuyển dữ liệu quản lý cài đặt
* Tích hợp di chuyển dữ liệu quản lý quyền
* Tích hợp di chuyển dữ liệu quản lý tính năng
* Tích hợp di chuyển dữ liệu điều hướng giao diện Vue Vben Admin
* Hỗ trợ cơ sở dữ liệu MySQL

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(PlatformEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpUINavigationVueVbenAdminModule),
    typeof(AbpDataDbMigratorModule)
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

2. Thêm phụ thuộc mô-đun
   ```csharp
   [DependsOn(typeof(PlatformMigrationsEntityFrameworkCoreModule))]
   public class YourModule : AbpModule
   {
       // ...
   }
   ```

## Mô tả bảng cơ sở dữ liệu

* Bảng liên quan đến Platform - dữ liệu nền tảng như từ điển dữ liệu, tổ chức, menu, phiên bản
* Bảng liên quan đến Saas - dữ liệu đa thuê bao như thuê bao, phiên bản
* AbpSettings - dữ liệu cài đặt hệ thống
* AbpPermissionGrants - dữ liệu cấp quyền
* AbpFeatures - dữ liệu tính năng
* AbpUINavigation - dữ liệu điều hướng giao diện Vue Vben Admin

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu Vue Vben Admin](https://doc.vvbin.cn/)
