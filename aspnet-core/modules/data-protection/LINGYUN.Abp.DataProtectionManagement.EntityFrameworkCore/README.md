# LINGYUN.Abp.DataProtectionManagement.EntityFrameworkCore

Module EntityFrameworkCore quản lý quyền dữ liệu, cung cấp triển khai truy cập dữ liệu của quản lý quyền dữ liệu.

## Chức năng

* Triển khai repository quản lý quyền dữ liệu
* Cấu hình ánh xạ cơ sở dữ liệu
* Migration cơ sở dữ liệu

## Triển khai repository

* `EfCoreDataProtectionRepository` - Triển khai repository quyền dữ liệu bằng EF Core
  * Triển khai interface `IDataProtectionRepository`
  * Cung cấp các thao tác CRUD cho quyền dữ liệu
  * Hỗ trợ lọc dữ liệu

## Cấu hình ánh xạ cơ sở dữ liệu

```csharp
public static class DataProtectionDbContextModelCreatingExtensions
{
    public static void ConfigureDataProtectionManagement(
        this ModelBuilder builder,
        Action<DataProtectionModelBuilderConfigurationOptions> optionsAction = null)
    {
        builder.Entity<DataProtection>(b =>
        {
            b.ToTable(options.TablePrefix + "DataProtections", options.Schema);

            b.ConfigureByConvention();

            b.Property(x => x.Name).IsRequired().HasMaxLength(DataProtectionConsts.MaxNameLength);
            b.Property(x => x.DisplayName).HasMaxLength(DataProtectionConsts.MaxDisplayNameLength);
            b.Property(x => x.Description).HasMaxLength(DataProtectionConsts.MaxDescriptionLength);

            b.HasIndex(x => x.Name);
        });
    }
}
```

## Cấu hình và sử dụng

1. Thêm dependency module

```csharp
[DependsOn(typeof(AbpDataProtectionManagementEntityFrameworkCoreModule))]
public class YourModule : AbpModule
{
}
```

2. Cấu hình DbContext

```csharp
public class YourDbContext : AbpDbContext<YourDbContext>, IDataProtectionManagementDbContext
{
    public DbSet<DataProtection> DataProtections { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ConfigureDataProtectionManagement();
    }
}
```

## Liên kết liên quan

* [English document](./README.EN.md)
