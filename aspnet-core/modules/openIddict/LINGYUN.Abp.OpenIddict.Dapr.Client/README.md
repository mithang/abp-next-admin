# LINGYUN.Abp.OpenIddict.Dapr.Client

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.Dapr.Client%2FLINGYUN.Abp.OpenIddict.Dapr.Client.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.Dapr.Client.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.Dapr.Client)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.Dapr.Client` là một module client OpenIddict dựa trên Dapr, cung cấp chức năng gọi dịch vụ từ xa OpenIddict bằng building block gọi dịch vụ của Dapr.

[English](./README.EN.md)

## Tính năng

* Tích hợp gọi dịch vụ Dapr
  * Tự động đăng ký proxy client Dapr cho các hợp đồng ứng dụng OpenIddict
  * Hỗ trợ truy cập dịch vụ từ xa OpenIddict thông qua gọi dịch vụ Dapr
  * Hỗ trợ giao tiếp giữa các dịch vụ trong hệ thống phân tán

* Hỗ trợ dịch vụ từ xa
  * Hỗ trợ mọi dịch vụ do hợp đồng ứng dụng OpenIddict định nghĩa
  * Hỗ trợ quản lý ứng dụng
  * Hỗ trợ quản lý ủy quyền
  * Hỗ trợ quản lý phạm vi (scope)
  * Hỗ trợ quản lý token

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.Dapr.Client
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictDaprClientModule))]` vào lớp module của bạn.

2. Cấu hình gọi dịch vụ Dapr:

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<AbpDaprClientOptions>(options =>
    {
        options.ApplicationServices.Configure(config =>
        {
            // Cấu hình AppId của dịch vụ OpenIddict
            config.AppId = "openiddict-service";
        });
    });
}
```

3. Ví dụ sử dụng:

```csharp
public class MyService
{
    private readonly IOpenIddictApplicationAppService _applicationAppService;

    public MyService(IOpenIddictApplicationAppService applicationAppService)
    {
        _applicationAppService = applicationAppService;
    }

    public async Task DoSomethingAsync()
    {
        // Truy cập dịch vụ ứng dụng OpenIddict thông qua gọi dịch vụ Dapr
        var applications = await _applicationAppService.GetListAsync(
            new GetApplicationsInput());
    }
}
```

## Cấu hình

* AppId
  * Định danh ứng dụng của dịch vụ OpenIddict
  * Phải khớp với ID ứng dụng trong cấu hình thành phần Dapr

* RemoteServiceName
  * Tên của dịch vụ từ xa OpenIddict
  * Giá trị mặc định là "OpenIddict"

## Lưu ý

* Đảm bảo Dapr Sidecar đã được cấu hình và chạy đúng cách
* Đảm bảo dịch vụ OpenIddict đã được đăng ký trong Dapr
* Nên cấu hình xác thực giữa các dịch vụ trong môi trường production
* Nên cấu hình chính sách thử lại cho việc gọi dịch vụ
* Nên cấu hình cơ chế phát hiện dịch vụ
