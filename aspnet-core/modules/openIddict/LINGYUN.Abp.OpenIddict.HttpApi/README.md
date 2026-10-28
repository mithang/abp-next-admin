# LINGYUN.Abp.OpenIddict.HttpApi

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.HttpApi%2FLINGYUN.Abp.OpenIddict.HttpApi.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.HttpApi.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.HttpApi)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.HttpApi` là mô-đun HTTP API của OpenIddict, cung cấp các giao diện API RESTful cho các chức năng liên quan đến OpenIddict.

[Tài liệu tiếng Anh](./README.EN.md)

## Tính năng

* Quản lý ứng dụng OpenIddict
  * Tạo, cập nhật, xóa ứng dụng
  * Truy vấn danh sách ứng dụng
  * Lấy chi tiết ứng dụng

* Quản lý ủy quyền OpenIddict
  * Truy vấn danh sách ủy quyền
  * Lấy chi tiết ủy quyền
  * Xóa bản ghi ủy quyền

* Quản lý mã thông báo OpenIddict
  * Truy vấn danh sách mã thông báo
  * Lấy chi tiết mã thông báo
  * Xóa bản ghi mã thông báo

* Quản lý phạm vi OpenIddict
  * Tạo, cập nhật, xóa phạm vi
  * Truy vấn danh sách phạm vi
  * Lấy chi tiết phạm vi

* Hỗ trợ đa ngôn ngữ
  * Tích hợp khung bản địa hóa ABP
  * Hỗ trợ tài nguyên bản địa hóa tùy chỉnh

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.HttpApi
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictHttpApiModule))]` vào lớp mô-đun của bạn.

2. Cấu hình quyền:

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<AbpPermissionOptions>(options =>
    {
        options.ValueProviders.Add<OpenIddictPermissionValueProvider>();
    });
}
```

3. Ví dụ sử dụng giao diện API:

```csharp
// Tiêm dịch vụ
private readonly IOpenIddictApplicationAppService _applicationService;

public YourService(IOpenIddictApplicationAppService applicationService)
{
    _applicationService = applicationService;
}

// Tạo ứng dụng
var input = new OpenIddictApplicationCreateDto
{
    ClientId = "your-client-id",
    DisplayName = "Your App",
    // ... các thuộc tính khác
};
var result = await _applicationService.CreateAsync(input);

// Truy vấn danh sách ứng dụng
var query = new OpenIddictApplicationGetListInput
{
    MaxResultCount = 10,
    SkipCount = 0,
    Filter = "search-term"
};
var list = await _applicationService.GetListAsync(query);
```

## Quyền

* OpenIddict.Applications
  * OpenIddict.Applications.Create
  * OpenIddict.Applications.Update
  * OpenIddict.Applications.Delete
  * OpenIddict.Applications.ManagePermissions

* OpenIddict.Scopes
  * OpenIddict.Scopes.Create
  * OpenIddict.Scopes.Update
  * OpenIddict.Scopes.Delete
  * OpenIddict.Scopes.ManagePermissions

* OpenIddict.Authorizations
  * OpenIddict.Authorizations.Delete
  * OpenIddict.Authorizations.ManagePermissions

* OpenIddict.Tokens
  * OpenIddict.Tokens.Delete
  * OpenIddict.Tokens.ManagePermissions

## Lưu ý

* Tất cả các giao diện API đều cần quyền tương ứng mới có thể truy cập
* Xóa ứng dụng sẽ đồng thời xóa các ủy quyền và mã thông báo liên quan
* Giao diện API hỗ trợ kịch bản đa thuê bao
* Khuyến nghị bật xác thực và ủy quyền API trong môi trường sản xuất
