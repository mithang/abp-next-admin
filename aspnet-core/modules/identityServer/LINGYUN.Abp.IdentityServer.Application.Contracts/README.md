# LINGYUN.Abp.IdentityServer.Application.Contracts

Mô-đun hợp đồng dịch vụ ứng dụng IdentityServer, định nghĩa các giao diện dịch vụ ứng dụng và DTO cho các chức năng quản lý tài nguyên IdentityServer4.

## Tính năng

* Định nghĩa quyền
  * Quyền máy khách
    * Quyền mặc định - `AbpIdentityServer.Clients`
    * Quyền tạo - `AbpIdentityServer.Clients.Create`
    * Quyền cập nhật - `AbpIdentityServer.Clients.Update`
    * Quyền xóa - `AbpIdentityServer.Clients.Delete`
    * Quyền nhân bản - `AbpIdentityServer.Clients.Clone`
    * Quyền quản lý - `AbpIdentityServer.Clients.ManagePermissions`
    * Quản lý claim - `AbpIdentityServer.Clients.ManageClaims`
    * Quản lý secret - `AbpIdentityServer.Clients.ManageSecrets`
    * Quản lý thuộc tính - `AbpIdentityServer.Clients.ManageProperties`

  * Quyền tài nguyên API
    * Quyền mặc định - `AbpIdentityServer.ApiResources`
    * Quyền tạo - `AbpIdentityServer.ApiResources.Create`
    * Quyền cập nhật - `AbpIdentityServer.ApiResources.Update`
    * Quyền xóa - `AbpIdentityServer.ApiResources.Delete`
    * Quản lý claim - `AbpIdentityServer.ApiResources.ManageClaims`
    * Quản lý secret - `AbpIdentityServer.ApiResources.ManageSecrets`
    * Quản lý scope - `AbpIdentityServer.ApiResources.ManageScopes`
    * Quản lý thuộc tính - `AbpIdentityServer.ApiResources.ManageProperties`

  * Quyền scope API
    * Quyền mặc định - `AbpIdentityServer.ApiScopes`
    * Quyền tạo - `AbpIdentityServer.ApiScopes.Create`
    * Quyền cập nhật - `AbpIdentityServer.ApiScopes.Update`
    * Quyền xóa - `AbpIdentityServer.ApiScopes.Delete`
    * Quản lý claim - `AbpIdentityServer.ApiScopes.ManageClaims`
    * Quản lý thuộc tính - `AbpIdentityServer.ApiScopes.ManageProperties`

  * Quyền tài nguyên danh tính
    * Quyền mặc định - `AbpIdentityServer.IdentityResources`
    * Quyền tạo - `AbpIdentityServer.IdentityResources.Create`
    * Quyền cập nhật - `AbpIdentityServer.IdentityResources.Update`
    * Quyền xóa - `AbpIdentityServer.IdentityResources.Delete`
    * Quản lý claim - `AbpIdentityServer.IdentityResources.ManageClaims`
    * Quản lý thuộc tính - `AbpIdentityServer.IdentityResources.ManageProperties`

  * Quyền cấp phép ủy quyền
    * Quyền mặc định - `AbpIdentityServer.Grants`
    * Quyền xóa - `AbpIdentityServer.Grants.Delete`

* Tài nguyên bản địa hóa
  * Hỗ trợ bản địa hóa đa ngôn ngữ
  * Tích hợp sẵn tài nguyên tiếng Trung và tiếng Anh

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityServerApplicationContractsModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Mô-đun phụ thuộc

* `AbpAuthorizationModule` - Mô-đun phân quyền ABP
* `AbpDddApplicationContractsModule` - Mô-đun hợp đồng dịch vụ ứng dụng DDD ABP
* `AbpIdentityServerDomainSharedModule` - Mô-đun chia sẻ miền IdentityServer

## Cấu hình và sử dụng

Mô-đun cung cấp định nghĩa giao diện dịch vụ ứng dụng và đối tượng truyền dữ liệu cần thiết cho việc quản lý tài nguyên IdentityServer4. Tất cả các quyền mặc định chỉ mở cho tenant máy chủ.

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu phân quyền ABP](https://docs.abp.io/en/abp/latest/Authorization)

[Xem tài liệu tiếng Anh](README.EN.md)
