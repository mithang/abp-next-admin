# LINGYUN.Abp.MicroService.MessageService.EntityFrameworkCore

Mô-đun di chuyển dữ liệu tin nhắn thời gian thực, cung cấp chức năng di chuyển cơ sở dữ liệu liên quan đến tin nhắn thời gian thực và hệ thống thông báo.

[English](./README.EN.md)

## Tính năng

* Tích hợp di chuyển dữ liệu đa thuê bao SaaS
* Tích hợp di chuyển dữ liệu hệ thống thông báo
* Tích hợp di chuyển dữ liệu dịch vụ tin nhắn
* Tích hợp di chuyển dữ liệu mẫu văn bản
* Tích hợp di chuyển dữ liệu quản lý cài đặt
* Tích hợp di chuyển dữ liệu quản lý quyền
* Tích hợp di chuyển dữ liệu quản lý tính năng
* Hỗ trợ cơ sở dữ liệu MySQL

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(AbpNotificationsEntityFrameworkCoreModule),
    typeof(AbpMessageServiceEntityFrameworkCoreModule),
    typeof(AbpTextTemplatingEntityFrameworkCoreModule),
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
    "RealtimeMessageDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Trong appsettings.json, cấu hình chuỗi kết nối RealtimeMessageDbMigrator

2. Thêm phụ thuộc mô-đun
   ```csharp
   [DependsOn(typeof(RealtimeMessageMigrationsEntityFrameworkCoreModule))]
   public class YourModule : AbpModule
   {
       // ...
   }
   ```

## Mô tả bảng cơ sở dữ liệu

* AbpNotifications - Bảng dữ liệu hệ thống thông báo
* AbpNotificationsDefinition - Bảng dữ liệu định nghĩa thông báo
* AbpMessageService - Bảng dữ liệu dịch vụ tin nhắn
* Các bảng liên quan đến Saas - Dữ liệu đa thuê bao như thuê bao, phiên bản
* AbpSettings - Dữ liệu cài đặt hệ thống
* AbpPermissionGrants - Dữ liệu cấp quyền
* AbpFeatures - Dữ liệu tính năng
* AbpTextTemplates - Dữ liệu mẫu văn bản

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu hệ thống thông báo ABP](https://docs.abp.io/zh-Hans/abp/latest/Notification-System)
