# LINGYUN.Abp.Identity.Domain.Shared

Module chia sẻ lĩnh vực xác thực danh tính, cung cấp các định nghĩa cơ sở liên quan đến xác thực danh tính.

## Tính năng

* Cung cấp tài nguyên bản địa hóa liên quan đến xác thực danh tính
* Cung cấp cấu hình hệ thống file ảo liên quan đến xác thực danh tính
* Mở rộng module Volo.Abp.Identity.AbpIdentityDomainSharedModule

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpIdentityDomainSharedModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cấu hình

Không cần cấu hình thêm.

## Cách dùng cơ bản

1. Tham chiếu module
```csharp
[DependsOn(typeof(AbpIdentityDomainSharedModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Sử dụng tài nguyên bản địa hóa
```csharp
public class YourClass
{
    private readonly IStringLocalizer<IdentityResource> _localizer;

    public YourClass(IStringLocalizer<IdentityResource> localizer)
    {
        _localizer = localizer;
    }

    public string GetLocalizedString(string key)
    {
        return _localizer[key];
    }
}
```

## Thông tin thêm

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)
