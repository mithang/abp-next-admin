# LINGYUN.Abp.IdentityServer.HttpApi

Mô-đun HTTP API IdentityServer, cung cấp giao diện HTTP API quản lý tài nguyên IdentityServer4.

## Tính năng

* Bộ điều khiển API
  * Bộ điều khiển phạm vi API - `ApiScopeController`
    * Tạo phạm vi API - POST `/api/identity-server/api-scopes`
    * Xóa phạm vi API - DELETE `/api/identity-server/api-scopes/{id}`
    * Lấy phạm vi API - GET `/api/identity-server/api-scopes/{id}`
    * Lấy danh sách phạm vi API - GET `/api/identity-server/api-scopes`
    * Cập nhật phạm vi API - PUT `/api/identity-server/api-scopes/{id}`

  * Bộ điều khiển tài nguyên API - `ApiResourceController`
    * Cung cấp giao diện thao tác CRUD của tài nguyên API
    * Tiền tố tuyến đường：`/api/identity-server/api-resources`

* Hỗ trợ bản địa hóa
  * Kế thừa cấu hình bản địa hóa của tài nguyên ABP UI
  * Hỗ trợ đa ngôn ngữ

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityServerHttpApiModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Mô-đun phụ thuộc

* `AbpIdentityServerApplicationContractsModule` - Mô-đun hợp đồng dịch vụ ứng dụng IdentityServer
* `AbpAspNetCoreMvcModule` - Mô-đun ABP ASP.NET Core MVC

## Cấu hình và sử dụng

### Cấu hình tên dịch vụ từ xa

```csharp
[RemoteService(Name = AbpIdentityServerConsts.RemoteServiceName)]
[Area("identity-server")]
[Route("api/identity-server/[controller]")]
public class YourController : AbpControllerBase
{
    // ...
}
```

### Thêm tài nguyên bản địa hóa

```csharp
Configure<AbpLocalizationOptions>(options =>
{
    options.Resources
        .Get<AbpIdentityServerResource>()
        .AddBaseTypes(typeof(AbpUiResource));
});
```

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu ABP ASP.NET Core MVC](https://docs.abp.io/en/abp/latest/AspNetCore-MVC)

[Xem tài liệu tiếng Anh](README.EN.md)
