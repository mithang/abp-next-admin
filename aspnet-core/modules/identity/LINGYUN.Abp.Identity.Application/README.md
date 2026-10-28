# LINGYUN.Abp.Identity.Application

Mô-đun dịch vụ ứng dụng xác thực danh tính, cung cấp các triển khai dịch vụ ứng dụng liên quan đến xác thực danh tính.

## Tính năng

* Mở rộng mô-đun Volo.Abp.Identity.AbpIdentityApplicationModule
* Cung cấp các triển khai dịch vụ ứng dụng liên quan đến xác thực danh tính
* Tích hợp ánh xạ đối tượng AutoMapper
* Hỗ trợ thuộc tính mở rộng URL ảnh đại diện người dùng

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityApplicationModule),
    typeof(AbpIdentityApplicationContractsModule),
    typeof(AbpIdentityDomainModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Dịch vụ ứng dụng

* IdentityUserAppService - Dịch vụ quản lý người dùng
* IdentityRoleAppService - Dịch vụ quản lý vai trò
* IdentityClaimTypeAppService - Dịch vụ quản lý loại claim
* IdentitySecurityLogAppService - Dịch vụ nhật ký bảo mật
* IdentitySettingsAppService - Dịch vụ cài đặt xác thực danh tính
* ProfileAppService - Dịch vụ hồ sơ người dùng

## Ánh xạ đối tượng

Mô-đun sử dụng AutoMapper để ánh xạ đối tượng, các ánh xạ chính bao gồm:

* IdentityUser -> IdentityUserDto
* IdentityRole -> IdentityRoleDto
* IdentityClaimType -> IdentityClaimTypeDto
* IdentitySecurityLog -> IdentitySecurityLogDto

## Cách dùng cơ bản

1. Sử dụng dịch vụ quản lý người dùng
```csharp
public class YourService
{
    private readonly IIdentityUserAppService _userAppService;

    public YourService(IIdentityUserAppService userAppService)
    {
        _userAppService = userAppService;
    }

    public async Task<IdentityUserDto> GetUserAsync(Guid id)
    {
        return await _userAppService.GetAsync(id);
    }
}
```

2. Sử dụng dịch vụ quản lý vai trò
```csharp
public class YourService
{
    private readonly IIdentityRoleAppService _roleAppService;

    public YourService(IIdentityRoleAppService roleAppService)
    {
        _roleAppService = roleAppService;
    }

    public async Task<IdentityRoleDto> GetRoleAsync(Guid id)
    {
        return await _roleAppService.GetAsync(id);
    }
}
```

## Thông tin thêm

* [Tài liệu xác thực ABP](https://docs.abp.io/en/abp/latest/Identity)
