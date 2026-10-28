# LINGYUN.Abp.OpenIddict.HttpApi.Client

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.HttpApi.Client%2FLINGYUN.Abp.OpenIddict.HttpApi.Client.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.HttpApi.Client.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.HttpApi.Client)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.HttpApi.Client` là module máy khách HTTP API của OpenIddict, cung cấp proxy máy khách để gọi từ xa HTTP API của OpenIddict.

[English](./README.EN.md)

## Tính năng

* Proxy máy khách HTTP API
  * Tự động tạo proxy máy khách HTTP
  * Hỗ trợ gọi dịch vụ từ xa
  * Tích hợp proxy máy khách HTTP động của ABP

* Cấu hình dịch vụ từ xa
  * Hỗ trợ cấu hình địa chỉ dịch vụ từ xa
  * Hỗ trợ cấu hình phương thức xác thực
  * Hỗ trợ cấu hình header yêu cầu

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.HttpApi.Client
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictHttpApiClientModule))]` vào lớp module của bạn.

2. Cấu hình dịch vụ từ xa:

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    var configuration = context.Services.GetConfiguration();
    
    Configure<AbpRemoteServiceOptions>(options =>
    {
        options.RemoteServices.Default = new RemoteServiceConfiguration
        {
            BaseUrl = configuration["RemoteServices:Default:BaseUrl"]
        };
    });
}
```

3. Ví dụ sử dụng:

```csharp
// Tiêm proxy máy khách
private readonly IOpenIddictApplicationAppService _applicationService;

public YourService(IOpenIddictApplicationAppService applicationService)
{
    _applicationService = applicationService;
}

// Gọi dịch vụ từ xa
var input = new OpenIddictApplicationCreateDto
{
    ClientId = "your-client-id",
    DisplayName = "Your App",
    // ... các thuộc tính khác
};
var result = await _applicationService.CreateAsync(input);
```

## Các mục cấu hình

* RemoteServices
  * Default:BaseUrl - Địa chỉ dịch vụ từ xa mặc định
  * OpenIddict:BaseUrl - Địa chỉ dịch vụ từ xa OpenIddict

## Lưu ý

* Cần cấu hình đúng địa chỉ dịch vụ từ xa
* Nếu dịch vụ từ xa cần xác thực, cần cấu hình thông tin xác thực tương ứng
* Khuyến nghị dùng HTTPS trong môi trường production
* Proxy máy khách sẽ tự xử lý việc truyền token xác thực
