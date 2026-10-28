# LINGYUN.Abp.PermissionManagement.Domain.OrganizationUnits

Mô-đun miền quản lý quyền của đơn vị tổ chức, cung cấp chức năng quản lý quyền dựa trên đơn vị tổ chức.

## Tính năng

* Quản lý quyền của đơn vị tổ chức
  * Hỗ trợ gán quyền cho đơn vị tổ chức
  * Hỗ trợ kế thừa quyền của đơn vị tổ chức
* Nhà cung cấp quyền
  * Triển khai nhà cung cấp quyền OrganizationUnit
  * Hỗ trợ kiểm tra quyền đơn vị tổ chức của vai trò
  * Hỗ trợ kiểm tra quyền đơn vị tổ chức của người dùng
* Tự động dọn dẹp quyền
  * Khi xóa đơn vị tổ chức sẽ tự động dọn dẹp các quyền liên quan

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpPermissionManagementDomainOrganizationUnitsModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

## Cách dùng cơ bản

1. Quản lý quyền của đơn vị tổ chức
```csharp
public class YourService
{
    private readonly IPermissionManager _permissionManager;

    public YourService(IPermissionManager permissionManager)
    {
        _permissionManager = permissionManager;
    }

    public async Task ManageOrganizationUnitPermissionAsync(string organizationUnitCode)
    {
        // Đặt quyền của đơn vị tổ chức
        await _permissionManager.SetAsync(
            "MyPermission",
            OrganizationUnitPermissionValueProvider.ProviderName,
            organizationUnitCode);

        // Kiểm tra quyền của đơn vị tổ chức
        var result = await _permissionManager.GetAsync(
            "MyPermission",
            OrganizationUnitPermissionValueProvider.ProviderName,
            organizationUnitCode);
    }
}
```

## Xem thêm

* [LINGYUN.Abp.PermissionManagement.Application](../LINGYUN.Abp.PermissionManagement.Application/README.md)
* [LINGYUN.Abp.PermissionManagement.Application.Contracts](../LINGYUN.Abp.PermissionManagement.Application.Contracts/README.md)
* [LINGYUN.Abp.PermissionManagement.HttpApi](../LINGYUN.Abp.PermissionManagement.HttpApi/README.md)
