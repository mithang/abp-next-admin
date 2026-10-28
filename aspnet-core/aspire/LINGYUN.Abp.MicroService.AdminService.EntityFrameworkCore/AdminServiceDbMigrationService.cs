using LINGYUN.Abp.Data.DbMigrator;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.DistributedLocking;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;

namespace LINGYUN.Abp.MicroService.AdminService;
public class AdminServiceDbMigrationService : EfCoreRuntimeDbMigratorBase<AdminServiceMigrationsDbContext>, ITransientDependency
{
    protected AdminServiceDataSeeder DataSeeder { get; }
    public AdminServiceDbMigrationService(
        ICurrentTenant currentTenant,
        IUnitOfWorkManager unitOfWorkManager,
        IServiceProvider serviceProvider,
        IAbpDistributedLock abpDistributedLock,
        IDistributedEventBus distributedEventBus,
        ILoggerFactory loggerFactory,
        AdminServiceDataSeeder dataSeeder)
        : base(
            ConnectionStringNameAttribute.GetConnStringName<AdminServiceMigrationsDbContext>(),
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
