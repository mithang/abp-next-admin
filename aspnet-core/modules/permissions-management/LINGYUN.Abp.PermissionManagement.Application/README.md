# LINGYUN.Abp.PermissionManagement.Application

Mô-đun dịch vụ ứng dụng quản lý quyền, cung cấp triển khai tầng ứng dụng quản lý quyền.

## Tính năng

* Quản lý định nghĩa nhóm quyền
  * Tạo, cập nhật, xóa định nghĩa nhóm quyền
  * Hỗ trợ bật/tắt nhóm quyền
  * Hỗ trợ cấu hình tĩnh/động nhóm quyền
* Quản lý định nghĩa quyền
  * Tạo, cập nhật, xóa định nghĩa quyền
  * Hỗ trợ bật/tắt quyền
  * Hỗ trợ cấu hình tĩnh/động quyền
  * Hỗ trợ quan hệ phân cấp cha-con của quyền
* Hỗ trợ đa thuê bao
  * Hỗ trợ hai chế độ đa thuê bao Host và Tenant
  * Hỗ trợ cấu hình phía đa thuê bao của quyền

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpPermissionManagementApplicationContractsModule),
    typeof(VoloAbpPermissionManagementApplicationModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

## Cách dùng cơ bản

1. Quản lý định nghĩa nhóm quyền
```csharp
public class YourService
{
    private readonly IPermissionGroupDefinitionAppService _groupDefinitionAppService;

    public YourService(IPermissionGroupDefinitionAppService groupDefinitionAppService)
    {
        _groupDefinitionAppService = groupDefinitionAppService;
    }

    public async Task ManageGroupDefinitionAsync()
    {
        // Tạo nhóm quyền
        await _groupDefinitionAppService.CreateAsync(new PermissionGroupDefinitionCreateDto
        {
            Name = "MyPermissionGroup",
            DisplayName = "My Permission Group"
        });

        // Cập nhật nhóm quyền
        await _groupDefinitionAppService.UpdateAsync("MyPermissionGroup", 
            new PermissionGroupDefinitionUpdateDto
            {
                DisplayName = "Updated Permission Group"
            });
    }
}
```

2. Quản lý định nghĩa quyền
```csharp
public class YourService
{
    private readonly IPermissionDefinitionAppService _permissionDefinitionAppService;

    public YourService(IPermissionDefinitionAppService permissionDefinitionAppService)
    {
        _permissionDefinitionAppService = permissionDefinitionAppService;
    }

    public async Task ManagePermissionDefinitionAsync()
    {
        // Tạo quyền
        await _permissionDefinitionAppService.CreateAsync(new PermissionDefinitionCreateDto
        {
            GroupName = "MyPermissionGroup",
            Name = "MyPermission",
            DisplayName = "My Permission",
            Providers = new[] { "Role", "User" }
        });

        // Cập nhật quyền
        await _permissionDefinitionAppService.UpdateAsync("MyPermission",
            new PermissionDefinitionUpdateDto
            {
                DisplayName = "Updated Permission"
            });
    }
}
```

## Xem thêm

* [LINGYUN.Abp.PermissionManagement.Application.Contracts](../LINGYUN.Abp.PermissionManagement.Application.Contracts/README.md)
* [LINGYUN.Abp.PermissionManagement.Domain.OrganizationUnits](../LINGYUN.Abp.PermissionManagement.Domain.OrganizationUnits/README.md)
* [LINGYUN.Abp.PermissionManagement.HttpApi](../LINGYUN.Abp.PermissionManagement.HttpApi/README.md)
