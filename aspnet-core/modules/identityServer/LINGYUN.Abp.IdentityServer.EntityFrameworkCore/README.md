# LINGYUN.Abp.IdentityServer.EntityFrameworkCore

Mô-đun IdentityServer EntityFrameworkCore, cung cấp triển khai Entity Framework Core của IdentityServer4.

## Tính năng

* Triển khai kho lưu trữ
  * Kho lưu trữ tài nguyên API - `EfCoreApiResourceRepository`
    * Lấy danh sách tên tài nguyên API
    * Kế thừa từ lớp cơ sở kho lưu trữ tài nguyên API của khung ABP

  * Kho lưu trữ tài nguyên danh tính - `EfCoreIdentityResourceRepository`
    * Kế thừa từ lớp cơ sở kho lưu trữ tài nguyên danh tính của khung ABP

  * Kho lưu trữ cấp quyền bền vững - `EfCorePersistentGrantRepository`
    * Kế thừa từ lớp cơ sở kho lưu trữ cấp quyền bền vững của khung ABP

* Ngữ cảnh cơ sở dữ liệu
  * Sử dụng `IIdentityServerDbContext` của khung ABP
  * Hỗ trợ tách biệt dữ liệu đa thuê bao

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityServerEntityFrameworkCoreModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Mô-đun phụ thuộc

* `LINGYUN.Abp.IdentityServer.AbpIdentityServerDomainModule` - Mô-đun miền IdentityServer
* `Volo.Abp.IdentityServer.EntityFrameworkCore.AbpIdentityServerEntityFrameworkCoreModule` - Mô-đun ABP IdentityServer EntityFrameworkCore

## Cấu hình sử dụng

### Cấu hình ngữ cảnh cơ sở dữ liệu

```csharp
public class YourDbContext : AbpDbContext<YourDbContext>, IIdentityServerDbContext
{
    public DbSet<ApiResource> ApiResources { get; set; }
    public DbSet<ApiScope> ApiScopes { get; set; }
    public DbSet<IdentityResource> IdentityResources { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<PersistedGrant> PersistedGrants { get; set; }
    public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }

    public YourDbContext(DbContextOptions<YourDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ConfigureIdentityServer();
    }
}
```

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu ABP EntityFrameworkCore](https://docs.abp.io/en/abp/latest/Entity-Framework-Core)

[Xem tài liệu tiếng Anh](README.EN.md)
