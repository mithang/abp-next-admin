# LINGYUN.Abp.Identity.EntityFrameworkCore

Module EntityFrameworkCore xác thực danh tính, cung cấp triển khai truy cập dữ liệu liên quan đến xác thực danh tính.

## Tính năng

* Mở rộng module Volo.Abp.Identity.EntityFrameworkCore.AbpIdentityEntityFrameworkCoreModule
* Cung cấp triển khai kho lưu trữ (repository) EF Core liên quan đến xác thực danh tính
* Hỗ trợ ánh xạ cơ sở dữ liệu cho thuộc tính mở rộng URL ảnh đại diện người dùng
* Cung cấp triển khai kho lưu trữ EF Core cho đơn vị tổ chức
* Cung cấp triển khai kho lưu trữ EF Core cho quản lý phiên

## Tham chiếu module

```csharp
[DependsOn(
    typeof(AbpIdentityDomainModule),
    typeof(Volo.Abp.Identity.EntityFrameworkCore.AbpIdentityEntityFrameworkCoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Triển khai kho lưu trữ

* EfCoreIdentityUserRepository - Triển khai kho lưu trữ người dùng
* EfCoreIdentityRoleRepository - Triển khai kho lưu trữ vai trò
* EfCoreIdentitySessionRepository - Triển khai kho lưu trữ phiên
* EfCoreOrganizationUnitRepository - Triển khai kho lưu trữ đơn vị tổ chức

## Cách dùng cơ bản

1. Cấu hình DbContext
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddAbpDbContext<IdentityDbContext>(options =>
    {
        options.AddRepository<IdentityRole, EfCoreIdentityRoleRepository>();
        options.AddRepository<IdentityUser, EfCoreIdentityUserRepository>();
        options.AddRepository<IdentitySession, EfCoreIdentitySessionRepository>();
        options.AddRepository<OrganizationUnit, EfCoreOrganizationUnitRepository>();
    });
}
```

2. Sử dụng kho lưu trữ
```csharp
public class YourService
{
    private readonly IRepository<IdentityUser, Guid> _userRepository;
    private readonly IRepository<IdentityRole, Guid> _roleRepository;

    public YourService(
        IRepository<IdentityUser, Guid> userRepository,
        IRepository<IdentityRole, Guid> roleRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
    }

    public async Task<IdentityUser> GetUserAsync(Guid id)
    {
        return await _userRepository.GetAsync(id);
    }

    public async Task<IdentityRole> GetRoleAsync(Guid id)
    {
        return await _roleRepository.GetAsync(id);
    }
}
```

## Di chuyển cơ sở dữ liệu (Database migration)

1. Thêm migration
```bash
dotnet ef migrations add Added_Identity_Tables
```

2. Cập nhật cơ sở dữ liệu
```bash
dotnet ef database update
```

## Thông tin thêm

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)
* [Tài liệu EF Core](https://docs.microsoft.com/en-us/ef/core/)
