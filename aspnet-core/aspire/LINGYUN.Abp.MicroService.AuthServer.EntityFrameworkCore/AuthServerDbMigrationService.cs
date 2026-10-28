using LINGYUN.Abp.Data.DbMigrator;
using LINGYUN.Abp.Saas.Tenants;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.DistributedLocking;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;

namespace LINGYUN.Abp.MicroService.AuthServer;

public class AuthServerDbMigrationService : EfCoreRuntimeDbMigratorBase<AuthServerMigrationsDbContext>, ITransientDependency
{
    protected AuthServerDataSeeder DataSeeder { get; }
    public AuthServerDbMigrationService(
        IDbSchemaMigrator dbSchemaMigrator,
        ITenantRepository tenantRepository,
        ICurrentTenant currentTenant,
        IUnitOfWorkManager unitOfWorkManager,
        IServiceProvider serviceProvider,
        IAbpDistributedLock abpDistributedLock,
        IDistributedEventBus distributedEventBus,
        ILoggerFactory loggerFactory,
        AuthServerDataSeeder dataSeeder)
        : base(
            ConnectionStringNameAttribute.GetConnStringName<AuthServerMigrationsDbContext>(), 
            unitOfWorkManager, serviceProvider, currentTenant, abpDistributedLock, distributedEventBus, loggerFactory)
    {
        DataSeeder = dataSeeder;
    }

    protected async override Task SeedAsync()
    {
        // Seed dữ liệu DbMigrator
        await DataSeeder.SeedAsync(new DataSeedContext());
    }
}