using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Saas.EntityFrameworkCore;

[DependsOn(typeof(AbpSaasDomainModule))]
[DependsOn(typeof(AbpEntityFrameworkCoreModule))]
public class AbpSaasEntityFrameworkCoreModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddAbpDbContext<SaasDbContext>(options =>
        {
            options.AddDefaultRepositories<ISaasDbContext>();
        });

        Configure<AbpDbConnectionOptions>(options =>
        {
            // Gộp chuỗi kết nối quản lý tenant vào mô-đun Saas
            options.Databases.Configure(AbpSaasDbProperties.ConnectionStringName,
                database =>
                {
                    database.MappedConnections.Add("AbpTenantManagement");
                    database.IsUsedByTenants = false;
                });
        });
    }
}
