# LINGYUN.Abp.MicroService.WebhookService.EntityFrameworkCore

Mô-đun di chuyển dữ liệu quản lý Webhooks, cung cấp chức năng di chuyển cơ sở dữ liệu liên quan đến hệ thống quản lý Webhooks.

[English](./README.EN.md)

## Tính năng

* Tích hợp di chuyển dữ liệu đa thuê bao SaaS
* Tích hợp di chuyển dữ liệu quản lý Webhooks
* Tích hợp di chuyển dữ liệu quản lý cài đặt
* Tích hợp di chuyển dữ liệu quản lý quyền
* Tích hợp di chuyển dữ liệu quản lý tính năng
* Hỗ trợ cơ sở dữ liệu MySQL

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(WebhooksManagementEntityFrameworkCoreModule),
    typeof(AbpEntityFrameworkCoreMySQLModule),
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
    "WebhooksManagementDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Trong appsettings.json cấu hình chuỗi kết nối WebhooksManagementDbMigrator

2. Thêm phụ thuộc mô-đun
   ```csharp
   [DependsOn(typeof(WebhooksManagementMigrationsEntityFrameworkCoreModule))]
   public class YourModule : AbpModule
   {
       // ...
   }
   ```

## Mô tả bảng cơ sở dữ liệu

* AbpWebhooks - Bảng thông tin cơ bản Webhooks
* AbpWebhookSubscriptions - Bảng đăng ký Webhooks
* AbpWebhookGroups - Bảng nhóm Webhooks
* AbpWebhookEvents - Bảng sự kiện Webhooks
* AbpWebhookSendAttempts - Bảng bản ghi gửi Webhooks
* Bảng liên quan đến Saas - dữ liệu đa thuê bao như thuê bao, phiên bản
* AbpSettings - Dữ liệu cài đặt hệ thống
* AbpPermissionGrants - Dữ liệu cấp quyền
* AbpFeatures - Dữ liệu tính năng

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Mô-đun ABP Webhooks](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/modules/webhooks-management)
