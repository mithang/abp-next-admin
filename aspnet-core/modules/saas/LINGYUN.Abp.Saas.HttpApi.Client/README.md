# LINGYUN.Abp.Saas.HttpApi.Client

Mô-đun client HTTP API SaaS, cung cấp triển khai proxy client HTTP cho quản lý tenant và edition.

## Tính năng

* Proxy client HTTP
  * Triển khai client HTTP của ITenantAppService
  * Triển khai client HTTP của IEditionAppService

## Cách sử dụng

1. Cài đặt mô-đun

```csharp
[DependsOn(typeof(AbpSaasHttpApiClientModule))]
public class YourModule : AbpModule
{
}
```

2. Cấu hình dịch vụ từ xa

```json
{
  "RemoteServices": {
    "Default": {
      "BaseUrl": "http://localhost:44388/"
    }
  }
}
```

3. Inject và sử dụng dịch vụ

```csharp
public class YourService
{
    private readonly ITenantAppService _tenantAppService;
    private readonly IEditionAppService _editionAppService;

    public YourService(
        ITenantAppService tenantAppService,
        IEditionAppService editionAppService)
    {
        _tenantAppService = tenantAppService;
        _editionAppService = editionAppService;
    }
}
```

## Thêm

[English](README.EN.md)
