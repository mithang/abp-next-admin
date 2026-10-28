# LINGYUN.Abp.DataProtection.EntityFrameworkCore

Module triển khai EF cho quyền dữ liệu

## Mô tả interface  

* DisableDataProtectedAttribute: Tự động triển khai DataFilter.Disable<IDataProtected>() thông qua interceptor, bộ lọc dữ liệu trong phạm vi hiện tại sẽ bị vô hiệu hóa  

## Lưu ý

* Khi dùng interface repository, cố gắng tránh dùng trực tiếp *await GetDbSetAsync()*, mà hãy dùng *await GetQueryableAsync()*, vì lý do mẫu thiết kế **DbSet** nên tạm thời chưa thể xử lý nó  
* Interface repository của bạn nên kế thừa **EfCoreDataProtectionRepository**, *DbContext* của bạn nên kế thừa **AbpDataProtectionDbContext**  

## Cấu hình và sử dụng

```csharp

[DependsOn(
    typeof(AbpDataProtectionEntityFrameworkCoreModule)
    )]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<DataProtectionManagementOptions>(options =>
        {
            // Lưu trữ bền vững danh sách thực thể được bảo vệ
            options.AddEntities(typeof(YouResource), new Type[]
            {
                typeof(YouProtectionObject),
            });

            // Định dạng như sau
            // options.AddEntities(typeof(IdentityResource), new Type[]
            // {
            //     typeof(IdentityUser),
            //     typeof(IdentityRole),
            //     typeof(OrganizationUnit),
            // });
        });
    }
}

public class YouDbContext : AbpDataProtectionDbContext<YouDbContext>
{
    public DbSet<YouProtectionObject> ProtectionObjects { get; set; }
    public YouDbContext(
        DbContextOptions<YouDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<YouProtectionObject>(b =>
        {
            // ...
        });
    }
}


public class EfCoreYouProtectionObjectRepository :
    EfCoreDataProtectionRepository<YouDbContext, YouProtectionObject, int>,
    IYouProtectionObjectRepository
{
    protected IDataFilter DataFilter { get; }
    public EfCoreYouProtectionObjectRepository(
        [NotNull] IDbContextProvider<YouDbContext> dbContextProvider, 
        [NotNull] IDataAuthorizationService dataAuthorizationService, 
        [NotNull] IEntityTypeFilterBuilder entityTypeFilterBuilder,
        IDataFilter dataFilter) 
        : base(dbContextProvider, dataAuthorizationService, entityTypeFilterBuilder)
    {
        DataFilter = dataFilter;
    }

    // Lấy danh sách dữ liệu được bảo vệ
    public async virtual Task<List<YouProtectionObject>> GetProtectedListAsync()
    {
        return await (await GetQueryableAsync())
            .ToListAsync();
    }

    // Gắn chú thích DisableDataProtected để lấy toàn bộ danh sách dữ liệu, tự động xử lý DataFilter.Disable<IDataProtected>() qua interceptor
    [DisableDataProtected]
    public async virtual Task<List<YouProtectionObject>> GetUnProtectedListAsync()
    {
        return await (await GetQueryableAsync())
            .ToListAsync();
    }

    // Vô hiệu hóa bộ lọc IDataProtected để lấy toàn bộ danh sách dữ liệu (có thể dùng ở bất cứ đâu)
    public async virtual Task<List<YouProtectionObject>> GetUnProtectedByFilterListAsync()
    {
        using (DataFilter.Disable<IDataProtected>())
        {
            return await (await GetQueryableAsync())
                .ToListAsync();
        }
    }
}
```

