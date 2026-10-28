# LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore

Mô-đun di chuyển dữ liệu ứng dụng đơn khối, cung cấp chức năng di chuyển cơ sở dữ liệu ứng dụng đầy đủ.

[English](./README.EN.md)

## Tính năng

* Tích hợp di chuyển dữ liệu nhật ký kiểm toán
* Tích hợp di chuyển dữ liệu quản lý cài đặt
* Tích hợp di chuyển dữ liệu quản lý quyền
* Tích hợp di chuyển dữ liệu quản lý tính năng
* Tích hợp di chuyển dữ liệu hệ thống thông báo
* Tích hợp di chuyển dữ liệu dịch vụ tin nhắn
* Tích hợp di chuyển dữ liệu quản lý nền tảng
* Tích hợp di chuyển dữ liệu quản lý bản địa hóa
* Tích hợp di chuyển dữ liệu xác thực danh tính
* Tích hợp di chuyển dữ liệu IdentityServer
* Tích hợp di chuyển dữ liệu OpenIddict
* Tích hợp di chuyển dữ liệu mẫu văn bản
* Tích hợp di chuyển dữ liệu quản lý Webhooks
* Tích hợp di chuyển dữ liệu quản lý tác vụ
* Tích hợp di chuyển dữ liệu đa thuê bao SaaS
* Hỗ trợ xử lý sự kiện di chuyển cơ sở dữ liệu
* Cung cấp dịch vụ di chuyển cơ sở dữ liệu

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(AbpAuditLoggingEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpNotificationsEntityFrameworkCoreModule),
    typeof(AbpMessageServiceEntityFrameworkCoreModule),
    typeof(PlatformEntityFrameworkCoreModule),
    typeof(AbpLocalizationManagementEntityFrameworkCoreModule),
    typeof(AbpIdentityEntityFrameworkCoreModule),
    typeof(AbpIdentityServerEntityFrameworkCoreModule),
    typeof(AbpOpenIddictEntityFrameworkCoreModule),
    typeof(AbpTextTemplatingEntityFrameworkCoreModule),
    typeof(WebhooksManagementEntityFrameworkCoreModule),
    typeof(TaskManagementEntityFrameworkCoreModule),
    typeof(AbpWeChatModule),
    typeof(AbpDataDbMigratorModule)
)]
```

## Cấu hình

```json
{
  "ConnectionStrings": {
    "SingleDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Trong appsettings.json, cấu hình chuỗi kết nối SingleDbMigrator

2. Thêm phụ thuộc mô-đun
   ```csharp
   [DependsOn(typeof(SingleMigrationsEntityFrameworkCoreModule))]
   public class YourModule : AbpModule
   {
       // ...
   }
   ```

## Mô tả bảng cơ sở dữ liệu

* AbpAuditLogs - Dữ liệu nhật ký kiểm toán
* Các bảng liên quan đến Identity - Dữ liệu liên quan đến xác thực danh tính như người dùng, vai trò, claim
* Các bảng liên quan đến IdentityServer - Dữ liệu liên quan đến OAuth/OpenID Connect như client, tài nguyên API, tài nguyên danh tính
* Các bảng liên quan đến OpenIddict - Dữ liệu liên quan đến xác thực OpenID Connect
* AbpPermissionGrants - Dữ liệu cấp quyền
* AbpSettings - Dữ liệu cài đặt hệ thống
* AbpFeatures - Dữ liệu tính năng
* AbpNotifications - Dữ liệu hệ thống thông báo
* AbpMessageService - Dữ liệu dịch vụ tin nhắn
* Các bảng liên quan đến Platform - Dữ liệu quản lý nền tảng
* AbpLocalization - Dữ liệu quản lý bản địa hóa
* AbpTextTemplates - Dữ liệu mẫu văn bản
* AbpWebhooks - Dữ liệu quản lý Webhooks
* AbpTasks - Dữ liệu quản lý tác vụ
* Các bảng liên quan đến Saas - Dữ liệu đa thuê bao như thuê bao, phiên bản

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Tài liệu OpenIddict](https://documentation.openiddict.com)
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io)
