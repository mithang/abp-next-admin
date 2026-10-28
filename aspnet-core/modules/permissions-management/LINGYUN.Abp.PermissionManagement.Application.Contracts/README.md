# LINGYUN.Abp.PermissionManagement.Application.Contracts

Mô-đun hợp đồng dịch vụ ứng dụng quản lý quyền, định nghĩa giao diện và DTO quản lý quyền.

## Tính năng

* Giao diện định nghĩa nhóm quyền
  * Cung cấp giao diện thao tác CRUD nhóm quyền
  * Hỗ trợ truy vấn phân trang nhóm quyền
* Giao diện định nghĩa quyền
  * Cung cấp giao diện thao tác CRUD quyền
  * Hỗ trợ truy vấn phân trang quyền
* DTO định nghĩa quyền
  * PermissionGroupDefinitionDto - DTO định nghĩa nhóm quyền
  * PermissionDefinitionDto - DTO định nghĩa quyền
  * Hỗ trợ cấu hình nhà cung cấp quyền (Role, User, OrganizationUnit, v.v.)
* Định nghĩa mã lỗi quyền
  * 001100 - Nhóm quyền đã tồn tại
  * 001010 - Không cho phép sửa đổi nhóm quyền tĩnh
  * 001404 - Nhóm quyền không tồn tại
  * 002100 - Quyền đã tồn tại
  * 002010 - Không cho phép sửa đổi quyền tĩnh
  * 002101 - Không thể lấy định nghĩa nhóm của quyền
  * 002404 - Quyền không tồn tại

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpPermissionManagementApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

## Định nghĩa quyền

```csharp
public class YourPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var permissionGroup = context.AddGroup(
            "YourPermissionGroup",
            "Your Permission Group");

        var permission = permissionGroup.AddPermission(
            "YourPermission",
            "Your Permission",
            MultiTenancySides.Both);

        permission.AddChild(
            "Create",
            "Create Permission");
    }
}
```

## Xem thêm

* [LINGYUN.Abp.PermissionManagement.Application](../LINGYUN.Abp.PermissionManagement.Application/README.md)
* [LINGYUN.Abp.PermissionManagement.Domain.OrganizationUnits](../LINGYUN.Abp.PermissionManagement.Domain.OrganizationUnits/README.md)
* [LINGYUN.Abp.PermissionManagement.HttpApi](../LINGYUN.Abp.PermissionManagement.HttpApi/README.md)
