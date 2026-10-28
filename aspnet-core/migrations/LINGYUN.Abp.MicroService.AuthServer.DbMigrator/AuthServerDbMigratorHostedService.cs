using LINGYUN.Abp.MicroService.AuthServer.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Volo.Abp;
using Volo.Abp.Data;

namespace LINGYUN.Abp.MicroService.AuthServer.DbMigrator;

public class AuthServerDbMigratorHostedService : IHostedService
{
    private readonly IHostApplicationLifetime _hostApplicationLifetime;
    private readonly IConfiguration _configuration;

    public AuthServerDbMigratorHostedService(
        IHostApplicationLifetime hostApplicationLifetime, 
        IConfiguration configuration)
    {
        _hostApplicationLifetime = hostApplicationLifetime;
        _configuration = configuration;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var application = await AbpApplicationFactory
            .CreateAsync<AuthServerDbMigratorModule>(options =>
        {
            // Lấy cấu hình bí mật người dùng từ biến môi trường, dùng cho kiểm thử container
            options.Configuration.UserSecretsId = Environment.GetEnvironmentVariable("APPLICATION_USER_SECRETS_ID");
            // Nếu container không chỉ định bí mật người dùng, đọc từ project
            options.Configuration.UserSecretsAssembly = typeof(AuthServerDbMigratorHostedService).Assembly;
            options.Services.ReplaceConfiguration(_configuration);
            options.UseAutofac();
            options.Services.AddLogging(c => c.AddSerilog());
            options.AddDataMigrationEnvironment();
        });
        await application.InitializeAsync();

        await application
            .ServiceProvider
            .GetRequiredService<AuthServerDbMigrationService>()
            .CheckAndApplyDatabaseMigrationsAsync();

        await application
            .ServiceProvider
            .GetRequiredService<AuthServerInitializeDataSeeder>()
            .SeedAsync(new DataSeedContext());

        await application.ShutdownAsync();

        _hostApplicationLifetime.StopApplication();
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}

