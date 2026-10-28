using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Users;

namespace LINGYUN.Abp.DataProtection.EntityFrameworkCore;

public abstract class AbpDataProtectionDbContext<TDbContext> : AbpDbContext<TDbContext>
    where TDbContext : DbContext
{
    public IOptions<AbpDataProtectionOptions> DataProtectionOptions => LazyServiceProvider.LazyGetRequiredService<IOptions<AbpDataProtectionOptions>>();
    public ICurrentUser CurrentUser => LazyServiceProvider.LazyGetRequiredService<ICurrentUser>();

    protected AbpDataProtectionDbContext(DbContextOptions<TDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        if (LazyServiceProvider != null)
        {
            // TODO: Cần tối ưu cây biểu thức
            //optionsBuilder.AddInterceptors(LazyServiceProvider.GetRequiredService<AbpDataProtectedWriteEntityInterceptor>());
            optionsBuilder.AddInterceptors(LazyServiceProvider.GetRequiredService<AbpDataProtectedWritePropertiesInterceptor>());
        }
    }

    protected override void ApplyAbpConceptsForAddedEntity(EntityEntry entry)
    {
        base.ApplyAbpConceptsForAddedEntity(entry);
        SetAuthorizationDataProperties(entry);
    }

    protected virtual void SetAuthorizationDataProperties(EntityEntry entry)
    {
        if (entry.Entity is IDataProtected data)
        {
            // TODO: Thêm điểm theo dõi, sau này có thể truy vấn bằng EF.Functions
            //if (data.GetProperty(DataAccessKeywords.AUTH_ROLES) == null)
            //{
            //    data.SetProperty(DataAccessKeywords.AUTH_ROLES, CurrentUser.Roles);
            //}
            //if (data.GetProperty(DataAccessKeywords.AUTH_ORGS) == null)
            //{
            //    data.SetProperty(DataAccessKeywords.AUTH_ORGS, CurrentUser.FindOrganizationUnits());
            //}
        }
    }
}
