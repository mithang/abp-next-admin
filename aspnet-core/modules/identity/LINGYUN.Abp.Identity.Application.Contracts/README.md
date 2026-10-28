# LINGYUN.Abp.Identity.Application.Contracts

Mô-đun hợp đồng dịch vụ ứng dụng xác thực danh tính, cung cấp định nghĩa giao diện dịch vụ ứng dụng liên quan đến xác thực danh tính.

## Tính năng

* Mở rộng mô-đun Volo.Abp.Identity.AbpIdentityApplicationContractsModule
* Cung cấp định nghĩa giao diện dịch vụ ứng dụng liên quan đến xác thực danh tính
* Cung cấp định nghĩa đối tượng DTO liên quan đến xác thực danh tính
* Tích hợp mô-đun ủy quyền ABP

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityApplicationContractsModule),
    typeof(AbpIdentityDomainSharedModule),
    typeof(AbpAuthorizationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện dịch vụ

* IIdentityUserAppService - Giao diện dịch vụ quản lý người dùng
* IIdentityRoleAppService - Giao diện dịch vụ quản lý vai trò
* IIdentityClaimTypeAppService - Giao diện dịch vụ quản lý loại claim
* IIdentitySecurityLogAppService - Giao diện dịch vụ nhật ký bảo mật
* IIdentitySettingsAppService - Giao diện dịch vụ cài đặt xác thực danh tính
* IProfileAppService - Giao diện dịch vụ hồ sơ người dùng

## Đối tượng DTO

* IdentityUserDto - DTO người dùng
* IdentityRoleDto - DTO vai trò
* IdentityClaimTypeDto - DTO loại claim
* IdentitySecurityLogDto - DTO nhật ký bảo mật
* GetIdentityUsersInput - DTO đầu vào lấy danh sách người dùng
* GetIdentityRolesInput - DTO đầu vào lấy danh sách vai trò
* IdentityUserCreateDto - DTO tạo người dùng
* IdentityUserUpdateDto - DTO cập nhật người dùng
* IdentityRoleCreateDto - DTO tạo vai trò
* IdentityRoleUpdateDto - DTO cập nhật vai trò

## Cách dùng cơ bản

1. Triển khai giao diện dịch vụ quản lý người dùng
```csharp
public class YourIdentityUserAppService : IIdentityUserAppService
{
    public async Task<IdentityUserDto> GetAsync(Guid id)
    {
        // Triển khai logic lấy người dùng
    }

    public async Task<PagedResultDto<IdentityUserDto>> GetListAsync(GetIdentityUsersInput input)
    {
        // Triển khai logic lấy danh sách người dùng
    }
}
```

2. Triển khai giao diện dịch vụ quản lý vai trò
```csharp
public class YourIdentityRoleAppService : IIdentityRoleAppService
{
    public async Task<IdentityRoleDto> GetAsync(Guid id)
    {
        // Triển khai logic lấy vai trò
    }

    public async Task<PagedResultDto<IdentityRoleDto>> GetListAsync(GetIdentityRolesInput input)
    {
        // Triển khai logic lấy danh sách vai trò
    }
}
```

## Thông tin thêm

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)
