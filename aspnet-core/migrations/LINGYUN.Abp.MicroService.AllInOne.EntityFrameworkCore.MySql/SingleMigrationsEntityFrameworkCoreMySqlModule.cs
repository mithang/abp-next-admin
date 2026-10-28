using DotNetCore.CAP;
using LINGYUN.Abp.EntityFrameworkCore.MySQL;
using LINGYUN.Abp.Quartz.MySqlInstaller;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Guids;
using Volo.Abp.Modularity;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.OpenIddict.Tokens;

namespace LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.MySql;

[DependsOn(
    typeof(AbpEntityFrameworkCoreMySQLMicrotingModule),
    // Module khởi tạo cơ sở dữ liệu MySql của Quartz
    typeof(AbpQuartzMySqlInstallerModule),
    // Tích hợp MySql cho module quy trình làm việc Elsa
    //typeof(AbpElsaEntityFrameworkCoreMySqlModule),
    typeof(SingleMigrationsEntityFrameworkCoreModule)
    )]
public class SingleMigrationsEntityFrameworkCoreMySqlModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var dbProvider = Environment.GetEnvironmentVariable("APPLICATION_DATABASE_PROVIDER");
        if ("MySql".Equals(dbProvider, StringComparison.InvariantCultureIgnoreCase))
        {
            var configuration = context.Services.GetConfiguration();

            PreConfigure<CapOptions>(options =>
            {
                if (configuration.GetValue<bool>("CAP:IsEnabled"))
                {
                    options.UseMySql(
                        sqlOptions =>
                        {
                            configuration.GetSection("CAP:MySql").Bind(sqlOptions);
                        });
                }
            });
        } 
    }
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var dbProvider = Environment.GetEnvironmentVariable("APPLICATION_DATABASE_PROVIDER");
        if ("MySql".Equals(dbProvider, StringComparison.InvariantCultureIgnoreCase))
        {
            Configure<AbpDbContextOptions>(options =>
            {
                options.UseMySQL(
                    mysql =>
                    {
                        // see: https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql/issues/1960
                        mysql.UseParameterizedCollectionMode(ParameterTranslationMode.Constant);
                        mysql.MigrationsAssembly(GetType().Assembly);
                    });
            });

            Configure<AbpSequentialGuidGeneratorOptions>(options =>
            {
                if (options.DefaultSequentialGuidType == null)
                {
                    options.DefaultSequentialGuidType = SequentialGuidType.SequentialAsString;
                }
            });

            context.Services.AddAbpDbContext<OpenIddictDbContext>(options =>
            {
                options.AddRepository<OpenIddictToken, EfCoreMySqlOpenIddictTokenRepository>();
            });
        }
    }
}
