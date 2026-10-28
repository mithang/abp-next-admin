using LINGYUN.Abp.MicroService.LocalizationService;
using LINGYUN.Abp.MicroService.ServiceDefaults;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.IO;
using Volo.Abp.IO;
using Volo.Abp.Modularity.PlugIns;

try
{
    Log.Information("Starting LocalizationService Host...");

    var builder = WebApplication.CreateBuilder(args);
    builder.Host.AddAppSettingsSecretsJson()
        .UseAutofac()
        .ConfigureAppConfiguration((context, config) =>
        {
            if (context.Configuration.GetValue("AgileConfig:IsEnabled", false))
            {
                config.AddAgileConfig(new AgileConfig.Client.ConfigClient(context.Configuration));
            }
        })
        .UseSerilog((context, provider, config) =>
        {
            config.ReadFrom.Configuration(context.Configuration);
        });

    builder.AddServiceDefaults();
    builder.AddCustomHealthChecks<ServiceHealthCheck>("Service");

    await builder.AddApplicationAsync<LocalizationServiceModule>(options =>
    {
        var applicationName = Environment.GetEnvironmentVariable("APPLICATION_NAME") ?? "LocalizationService";
        AbpSerilogEnrichersConsts.ApplicationName = applicationName;
        options.ApplicationName = applicationName;

        var pluginFolder = Path.Combine(Directory.GetCurrentDirectory(), "Modules");
        DirectoryHelper.CreateIfNotExists(pluginFolder);
        options.PlugInSources.AddFolder(pluginFolder, SearchOption.AllDirectories);
    });

    var app = builder.Build();

    await app.InitializeApplicationAsync();

    app.MapDefaultEndpoints();
    app.MapCustomHealthChecks("/health/service");

    app.UseForwardedHeaders();
    // Bản địa hóa
    app.UseMapRequestLocalization();
    // Chuỗi gọi HTTP
    app.UseCorrelationId();
    // Hệ thống tệp ảo
    app.MapAbpStaticAssets();
    // Định tuyến
    app.UseRouting();
    // Cross-domain
    app.UseCors();
    // Xác thực
    app.UseAuthentication();
    app.UseJwtTokenMiddleware();
    // Đa tenant
    app.UseMultiTenancy();
    app.UseDynamicClaims();
    // Ủy quyền
    app.UseAuthorization();
    // DEVOPS iter-0009: swagger middleware only in Development, same
    // fix as ApiGateway Program.cs (iter-0008). The swagger provider is
    // registered by AddAbpSwaggerGenWithOAuth, which is skipped when no
    // AuthServer:Authority is configured -- but UseSwagger() used to run
    // unconditionally, and Swashbuckle resolves ISwaggerProvider eagerly,
    // so EVERY request (including /healthz) answered 500 in Production.
    if (app.Environment.IsDevelopment())
    {
    // Swagger
    app.UseSwagger();
    // Giao diện trực quan Swagger
    app.UseAbpSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Support Localization Service API");

        var configuration = app.Configuration;
        options.OAuthClientId(configuration["AuthServer:SwaggerClientId"]);
        options.OAuthScopes(configuration["AuthServer:Audience"]);
    });
    }
    // Nhật ký kiểm toán
    app.UseAuditing();
    app.UseAbpSerilogEnrichers();
    // Định tuyến
    app.UseConfiguredEndpoints();

    await app.RunAsync();
}
catch (Exception ex)
{
    if (ex is HostAbortedException)
    {
        throw;
    }

    Log.Fatal(ex, "Host terminated unexpectedly!");
}
finally
{
    await Log.CloseAndFlushAsync();
}