# LINGYUN.Abp.MicroService.TaskService.EntityFrameworkCore

Mô-đun di chuyển dữ liệu quản lý tác vụ, cung cấp chức năng di chuyển cơ sở dữ liệu liên quan đến hệ thống quản lý tác vụ.

[English](./README.EN.md)

## Tính năng

* Tích hợp di chuyển dữ liệu đa thuê bao SaaS
* Tích hợp di chuyển dữ liệu quản lý tác vụ
* Tích hợp di chuyển dữ liệu quản lý cài đặt
* Tích hợp di chuyển dữ liệu quản lý quyền
* Tích hợp di chuyển dữ liệu quản lý tính năng
* Hỗ trợ cơ sở dữ liệu MySQL

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(TaskManagementEntityFrameworkCoreModule),
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
    "TaskManagementDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Cấu hình chuỗi kết nối TaskManagementDbMigrator trong appsettings.json

2. Thêm phụ thuộc mô-đun
   ```csharp
   [DependsOn(typeof(TaskManagementMigrationsEntityFrameworkCoreModule))]
   public class YourModule : AbpModule
   {
       // ...
   }
   ```

## Mô tả bảng cơ sở dữ liệu

* AbpTasks - Bảng thông tin cơ bản của tác vụ
* AbpTaskCategories - Bảng phân loại tác vụ
* AbpTaskStatuses - Bảng trạng thái tác vụ
* AbpTaskAssignments - Bảng phân công tác vụ
* Các bảng liên quan đến Saas - Dữ liệu đa thuê bao như thuê bao, phiên bản
* AbpSettings - Dữ liệu cài đặt hệ thống
* AbpPermissionGrants - Dữ liệu cấp quyền
* AbpFeatures - Dữ liệu tính năng

## Thông tin thêm

* [Tài liệu ABP](https://docs.abp.io)
* [Mô-đun quản lý tác vụ ABP](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/modules/task-management)
