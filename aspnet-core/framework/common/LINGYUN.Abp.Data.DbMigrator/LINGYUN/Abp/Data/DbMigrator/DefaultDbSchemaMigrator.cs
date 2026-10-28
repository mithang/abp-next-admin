using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.Data.DbMigrator;

public class DefaultDbSchemaMigrator : IDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ICurrentTenant _currentTenant;
    private readonly AbpDbConnectionOptions _dbConnectionOptions;

    public DefaultDbSchemaMigrator(
        ICurrentTenant currentTenant,
        IServiceProvider serviceProvider,
        IOptions<AbpDbConnectionOptions> dbConnectionOptions)
    {
        _currentTenant = currentTenant;
        _serviceProvider = serviceProvider;
        _dbConnectionOptions = dbConnectionOptions.Value;
    }

    public async virtual Task MigrateAsync<TDbContext>(
        [NotNull] Func<string, DbContextOptionsBuilder<TDbContext>, TDbContext> configureDbContext) 
        where TDbContext : AbpDbContext<TDbContext>
    {
        var connectionStringName = ConnectionStringNameAttribute.GetConnStringName<TDbContext>();

        string? connectionString = null;
        if (_currentTenant.IsAvailable)
        {
            var connectionStringResolver = _serviceProvider.GetRequiredService<IConnectionStringResolver>();
            connectionString = await connectionStringResolver.ResolveAsync(connectionStringName);
        }
        else
        {
            connectionString = _dbConnectionOptions.GetConnectionStringOrNull(
                connectionStringName,
                fallbackToDatabaseMappings: false,
                fallbackToDefault: false);
        }

        var defaultConnectionString = _dbConnectionOptions.GetConnectionStringOrNull(connectionStringName);
        // Nếu chuỗi kết nối của tenant giống với chuỗi kết nối mặc định thì không thực thi script migration
        if (string.Equals(
            connectionString,
            defaultConnectionString,
            StringComparison.InvariantCultureIgnoreCase))
        {
            return;
        }

        connectionString ??= defaultConnectionString;

        var dbContextBuilder = new DbContextOptionsBuilder<TDbContext>();
        using var dbContext = configureDbContext(connectionString!, dbContextBuilder);

        await dbContext.Database.MigrateAsync();
    }
}
