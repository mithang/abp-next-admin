using LINGYUN.Abp.MicroService.ApiGateway;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using System;
using System.IO;
using System.Linq;
using Volo.Abp;
using Volo.Abp.IO;
using Volo.Abp.Modularity.PlugIns;
using Yarp.ReverseProxy.Configuration;

Log.Information("Starting ApiGateway Host...");

try
{
    var builder = WebApplication.CreateBuilder(args);
    builder.Host.AddAppSettingsSecretsJson()
        .UseAutofac()
        .ConfigureAppConfiguration((context, config) =>
        {
            if (context.Configuration.GetValue("AgileConfig:IsEnabled", false))
            {
                config.AddAgileConfig(new AgileConfig.Client.ConfigClient(context.Configuration));
            }
            config.AddJsonFile("yarp.json", optional: true, reloadOnChange: true);
        })
        .UseSerilog((context, provider, config) =>
        {
            config.ReadFrom.Configuration(context.Configuration);
        });

    builder.AddServiceDefaults();

    await builder.AddApplicationAsync<ApiGatewayModule>(options =>
    {
        var applicationName = Environment.GetEnvironmentVariable("APPLICATION_NAME") ?? "ApiGateway";
        options.ApplicationName = applicationName;
        AbpSerilogEnrichersConsts.ApplicationName = applicationName;

        var pluginFolder = Path.Combine(Directory.GetCurrentDirectory(), "Modules");
        DirectoryHelper.CreateIfNotExists(pluginFolder);
        options.PlugInSources.AddFolder(pluginFolder, SearchOption.AllDirectories);
    });

    var app = builder.Build();

    await app.InitializeApplicationAsync();

    app.MapDefaultEndpoints();

    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    app.UseCorrelationId();
    app.UseCors();

    // Xác thực
    app.UseAuthentication();
    // jwt
    app.UseDynamicClaims();
    // Ủy quyền
    app.UseAuthorization();

    // DEVOPS iter-0008: swagger middleware only in Development. The
    // swagger provider is registered by AddAbpSwaggerGenWithOAuth, which
    // is skipped when no AuthServer:Authority is configured (see
    // ApiGatewayModule) — but UseSwagger() used to run unconditionally,
    // and Swashbuckle resolves ISwaggerProvider eagerly, so EVERY
    // request (including /healthz) answered 500 in Production. Swagger
    // is dev tooling for this gateway; Production serves no API docs
    // from it, so gating the middleware to Development is the correct
    // fix rather than registering a dummy provider.
    if (app.Environment.IsDevelopment())
    {
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Open API Document");

        var configuration = app.Services.GetRequiredService<IConfiguration>();
        var logger = app.Services.GetRequiredService<ILogger<ApplicationInitializationContext>>();
        var proxyConfigProvider = app.Services.GetRequiredService<IProxyConfigProvider>();
        var yarpConfig = proxyConfigProvider.GetConfig();

        var routedClusters = yarpConfig.Clusters
            .SelectMany(t => t.Destinations,
                (clusterId, destination) => new { clusterId.ClusterId, destination.Value });

        var groupedClusters = routedClusters
            .GroupBy(q => q.Value.Address)
            .Select(t => t.First())
            .Distinct()
            .ToList();

        foreach (var clusterGroup in groupedClusters)
        {
            var routeConfig = yarpConfig.Routes.FirstOrDefault(q =>
                q.ClusterId == clusterGroup.ClusterId);
            if (routeConfig == null)
            {
                logger.LogWarning($"Swagger UI: Couldn't find route configuration for {clusterGroup.ClusterId}...");
                continue;
            }

            if (clusterGroup.Value.Metadata != null &&
                clusterGroup.Value.Metadata.TryGetValue("SwaggerEndpoint", out var address) &&
                !address.IsNullOrWhiteSpace())
            {
                options.SwaggerEndpoint($"{address}/swagger/v1/swagger.json", $"{routeConfig.ClusterId} API");
            }
            options.OAuthClientId(configuration["AuthServer:SwaggerClientId"]);
            options.OAuthClientSecret(configuration["AuthServer:SwaggerClientSecret"]);
        }
    });
    }

    // app.UseRewriter(new RewriteOptions().AddRedirect("^(|\\|\\s+)$", "/swagger"));

    app.UseRouting();
    app.UseAuditing();
    app.UseAbpSerilogEnrichers();
    app.UseWebSockets();
    app.UseWebSocketsTelemetry();
    app.UseConfiguredEndpoints(endpoints =>
    {
        endpoints.MapReverseProxy();
    });

    await app.RunAsync();
}
catch (Exception ex)
{
    if (ex is HostAbortedException)
    {
        throw;
    }

    Log.Fatal(ex, "Host terminated unexpectedly!");
    // DEVOPS iter-0007: Log.Fatal above goes to Serilog's silent default
    // logger when startup fails before UseSerilog takes effect, which is
    // why this host previously exited 0 with no output at all. Mirror the
    // services/ hosts' pattern: always print to stdout and exit non-zero
    // so an orchestrator sees a crash, not a clean shutdown.
    Console.WriteLine("Host terminated unexpectedly!");
    Console.WriteLine(ex.ToString());
    Environment.Exit(1);
}
finally
{
    await Log.CloseAndFlushAsync();
}