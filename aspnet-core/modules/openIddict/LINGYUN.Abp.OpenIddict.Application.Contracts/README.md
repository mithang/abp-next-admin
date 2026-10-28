# LINGYUN.Abp.OpenIddict.Application.Contracts

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.Application.Contracts%2FLINGYUN.Abp.OpenIddict.Application.Contracts.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.Application.Contracts.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.Application.Contracts)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.Application.Contracts` là tầng hợp đồng của dịch vụ ứng dụng OpenIddict, định nghĩa các interface, DTO và quyền cần thiết cho việc quản lý OpenIddict.

[English](./README.EN.md)

## Tính năng

* Định nghĩa các interface dịch vụ ứng dụng OpenIddict
  * IOpenIddictApplicationAppService
  * IOpenIddictAuthorizationAppService
  * IOpenIddictTokenAppService
  * IOpenIddictScopeAppService

* Cung cấp các đối tượng DTO chuẩn hóa
  * OpenIddictApplicationDto
  * OpenIddictAuthorizationDto
  * OpenIddictTokenDto
  * OpenIddictScopeDto
  * cùng các DTO tạo mới và cập nhật tương ứng

* Định nghĩa quyền
  * OpenIddict.Applications
  * OpenIddict.Authorizations
  * OpenIddict.Tokens
  * OpenIddict.Scopes

* Hỗ trợ đa ngôn ngữ
  * Tích hợp sẵn tài nguyên bản địa hóa tiếng Trung và tiếng Anh
  * Hỗ trợ mở rộng ngôn ngữ tùy chỉnh

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.Application.Contracts
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictApplicationContractsModule))]` vào lớp mô-đun của bạn.

2. Inject và sử dụng các interface dịch vụ ứng dụng tương ứng:

```csharp
public class YourService
{
    private readonly IOpenIddictApplicationAppService _applicationAppService;
    
    public YourService(IOpenIddictApplicationAppService applicationAppService)
    {
        _applicationAppService = applicationAppService;
    }
    
    public async Task DoSomethingAsync()
    {
        var applications = await _applicationAppService.GetListAsync(
            new OpenIddictApplicationGetListInput());
        // ...
    }
}
```

## Quyền

Mô-đun định nghĩa các quyền sau:

* OpenIddict.Applications
  * OpenIddict.Applications.Create
  * OpenIddict.Applications.Update
  * OpenIddict.Applications.Delete
  * OpenIddict.Applications.ManagePermissions
  * OpenIddict.Applications.ManageSecret
* OpenIddict.Authorizations
  * OpenIddict.Authorizations.Delete
* OpenIddict.Scopes
  * OpenIddict.Scopes.Create
  * OpenIddict.Scopes.Update
  * OpenIddict.Scopes.Delete
* OpenIddict.Tokens
  * OpenIddict.Tokens.Delete

## Bản địa hóa

Mô-đun hỗ trợ đa ngôn ngữ, tích hợp sẵn các ngôn ngữ sau:

* Tiếng Anh (en)
* Tiếng Trung giản thể (zh-Hans)

Có thể mở rộng ngôn ngữ mới bằng cách sau:

```csharp
Configure<AbpLocalizationOptions>(options =>
{
    options.Resources
        .Get<AbpOpenIddictResource>()
        .AddVirtualJson("/YourPath/Localization/Resources");
});
```
