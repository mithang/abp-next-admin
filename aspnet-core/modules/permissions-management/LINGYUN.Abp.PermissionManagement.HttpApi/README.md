# LINGYUN.Abp.PermissionManagement.HttpApi

Mô-đun HTTP API quản lý quyền, cung cấp giao diện RESTful API quản lý quyền.

## Tính năng

* API định nghĩa nhóm quyền
  * Cung cấp giao diện thao tác CRUD nhóm quyền
  * Hỗ trợ truy vấn phân trang nhóm quyền
* API định nghĩa quyền
  * Cung cấp giao diện thao tác CRUD quyền
  * Hỗ trợ truy vấn phân trang quyền
* Lớp cơ sở API thống nhất
  * PermissionManagementControllerBase - Lớp cơ sở bộ điều khiển quản lý quyền
  * Định dạng phản hồi API chuẩn hóa

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpPermissionManagementApplicationContractsModule),
    typeof(AbpPermissionManagementHttpApiModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

## Giao diện API

1. Định nghĩa nhóm quyền
```
GET    /api/permission-management/groups
POST   /api/permission-management/groups
PUT    /api/permission-management/groups/{name}
DELETE /api/permission-management/groups/{name}
```

2. Định nghĩa quyền
```
GET    /api/permission-management/permissions
POST   /api/permission-management/permissions
PUT    /api/permission-management/permissions/{name}
DELETE /api/permission-management/permissions/{name}
```

## Cách dùng cơ bản

1. Quản lý định nghĩa nhóm quyền
```http
### Tạo nhóm quyền
POST /api/permission-management/groups
{
    "name": "MyPermissionGroup",
    "displayName": "My Permission Group"
}

### Cập nhật nhóm quyền
PUT /api/permission-management/groups/MyPermissionGroup
{
    "displayName": "Updated Permission Group"
}
```

2. Quản lý định nghĩa quyền
```http
### Tạo quyền
POST /api/permission-management/permissions
{
    "groupName": "MyPermissionGroup",
    "name": "MyPermission",
    "displayName": "My Permission",
    "providers": ["Role", "User"]
}

### Cập nhật quyền
PUT /api/permission-management/permissions/MyPermission
{
    "displayName": "Updated Permission"
}
```

## Xem thêm

* [LINGYUN.Abp.PermissionManagement.Application](../LINGYUN.Abp.PermissionManagement.Application/README.md)
* [LINGYUN.Abp.PermissionManagement.Application.Contracts](../LINGYUN.Abp.PermissionManagement.Application.Contracts/README.md)
* [LINGYUN.Abp.PermissionManagement.Domain.OrganizationUnits](../LINGYUN.Abp.PermissionManagement.Domain.OrganizationUnits/README.md)
