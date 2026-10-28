# LINGYUN.Abp.FeatureManagement.Client

Quản lý ủy quyền xác thực tính năng dành cho phía máy khách

## Tính năng

* Cung cấp nhà cung cấp quản lý tính năng máy khách (ClientFeatureManagementProvider)
* Hỗ trợ quản lý quyền của tính năng máy khách
* Hỗ trợ quản lý tài nguyên bản địa hóa
* Tích hợp liền mạch với mô-đun quản lý tính năng của framework ABP

## Cấu hình và sử dụng

1. Thêm phụ thuộc mô-đun

```csharp
[DependsOn(typeof(AbpFeatureManagementClientModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

2. Cấu hình quyền

Mô-đun đã định nghĩa sẵn các quyền sau:
* FeatureManagement.ManageClientFeatures：Quyền quản lý tính năng máy khách

3. Ví dụ sử dụng

```csharp
public class YourService
{
    private readonly IFeatureManager _featureManager;

    public YourService(IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }

    public async Task SetClientFeatureAsync(string clientId, string featureName, string value)
    {
        // Thiết lập giá trị tính năng máy khách
        await _featureManager.SetForClientAsync(clientId, featureName, value);
    }
}
```

## Thêm

* Mô-đun này phụ thuộc vào mô-đun LINGYUN.Abp.Features.Client
* Hỗ trợ cấu hình bản địa hóa thông qua AbpFeatureManagementResource
* Cung cấp kiểm soát quyền đối với quản lý tính năng máy khách

[Tiếng Việt](./README.md) | [English](./README.EN.md)
