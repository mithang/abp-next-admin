# LINGYUN.Abp.Features.Client

Xác thực tính năng dành cho phía client

## Tính năng

* Cung cấp trình cung cấp giá trị tính năng phía client (ClientFeatureValueProvider)
* Hỗ trợ xác thực tính năng dựa trên ID client
* Tích hợp liền mạch với hệ thống quản lý tính năng của ABP framework

## Cấu hình và sử dụng

1. Thêm phụ thuộc module

```csharp
[DependsOn(typeof(AbpFeaturesClientModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

2. Ví dụ sử dụng

```csharp
public class YourService
{
    private readonly IFeatureChecker _featureChecker;

    public YourService(IFeatureChecker featureChecker)
    {
        _featureChecker = featureChecker;
    }

    public async Task DoSomethingAsync()
    {
        // Kiểm tra xem client có bật tính năng nào đó hay không
        if (await _featureChecker.IsEnabledAsync("YourFeature"))
        {
            // Logic nghiệp vụ
        }
    }
}
```

## Thêm thông tin

* Module này chủ yếu dùng để xác thực tính năng phía client, thường được sử dụng kết hợp với module LINGYUN.Abp.FeatureManagement.Client
* Tên của trình cung cấp giá trị tính năng phía client là "C"

[Tiếng Việt](./README.md) | [English](./README.EN.md)
