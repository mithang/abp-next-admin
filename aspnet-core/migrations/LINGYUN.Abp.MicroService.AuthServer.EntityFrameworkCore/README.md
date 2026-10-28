# LINGYUN.Abp.MicroService.AuthServer.EntityFrameworkCore

Module migration cơ sở dữ liệu máy chủ xác thực, cung cấp chức năng migration cơ sở dữ liệu mà máy chủ xác thực cần.

[English](./README.EN.md)

## Tính năng

* Tích hợp migration cơ sở dữ liệu của framework xác thực OpenIddict
* Tích hợp migration cơ sở dữ liệu của module ABP Identity
* Tích hợp migration cơ sở dữ liệu của module quản lý quyền ABP
* Tích hợp migration cơ sở dữ liệu của module quản lý cài đặt ABP
* Tích hợp migration cơ sở dữ liệu của module quản lý tính năng ABP
* Tích hợp migration cơ sở dữ liệu của module đa tenant SaaS ABP
* Tích hợp migration cơ sở dữ liệu của module mẫu văn bản
* Hỗ trợ cơ sở dữ liệu MySQL

## Tham chiếu module

```csharp
[DependsOn(
    typeof(AbpAuthorizationModule),
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(AbpOpenIddictEntityFrameworkCoreModule),
    typeof(AbpIdentityEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpTextTemplatingEntityFrameworkCoreModule),
    typeof(AbpDataDbMigratorModule)
)]
public class YourModule : AbpModule
{
    // other
}
```

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "AuthServerDbMigrator": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  }
}
```

## Cách dùng cơ bản

1. Cấu hình chuỗi kết nối cơ sở dữ liệu
   * Cấu hình chuỗi kết nối AuthServerDbMigrator trong appsettings.json

2. Thêm DbContext
   ```csharp
   public override void ConfigureServices(ServiceConfigurationContext context)
   {
       context.Services.AddAbpDbContext<AuthServerMigrationsDbContext>();

       Configure<AbpDbContextOptions>(options =>
       {
           options.UseMySQL();
       });
   }
   ```

3. Thực thi migration cơ sở dữ liệu
   * Dùng công cụ dòng lệnh EF Core để thực thi migration
   ```bash
   dotnet ef database update
   ```

## Lưu ý

* Đảm bảo chuỗi kết nối cơ sở dữ liệu có quyền chính xác để có thể tạo và sửa bảng cơ sở dữ liệu
* Trước khi thực thi migration, nên sao lưu cơ sở dữ liệu trước
* Script migration sẽ tự động xử lý quan hệ phụ thuộc giữa các module
