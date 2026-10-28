using LINGYUN.Abp.AspNetCore.Mvc.Wrapper;
using LINGYUN.Abp.AuditLogging.IP.Location;
using LINGYUN.Abp.IP2Region;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.WebSockets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.ApiExploring;
using Volo.Abp.AspNetCore.Mvc.ApplicationConfigurations;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.Data;
using Volo.Abp.Modularity;
using Volo.Abp.Swashbuckle;

namespace LINGYUN.Abp.MicroService.ApiGateway;

[DependsOn(
    typeof(AbpSerilogEnrichersApplicationModule),
    typeof(AbpSerilogEnrichersUniqueIdModule),
    typeof(AbpAutofacModule),
    typeof(AbpDataModule),
    typeof(AbpSwashbuckleModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpAspNetCoreMvcWrapperModule),
    typeof(AbpAuditLoggingIPLocationModule),
    typeof(AbpIP2RegionModule)
)]
public class ApiGatewayModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<AbpSerilogEnrichersUniqueIdOptions>(options =>
        {
            // Phân biệt bằng cổng mở
            options.SnowflakeIdOptions.WorkerId = 0;
            options.SnowflakeIdOptions.WorkerIdBits = 5;
            options.SnowflakeIdOptions.DatacenterId = 1;
        });
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();
        var hostingEnvironment = context.Services.GetHostingEnvironment();

        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ControllersToRemove.Add(typeof(AbpApiDefinitionController));
            options.ControllersToRemove.Add(typeof(AbpApplicationLocalizationController));
            options.ControllersToRemove.Add(typeof(AbpApplicationConfigurationController));
            options.ControllersToRemove.Add(typeof(AbpApplicationConfigurationScriptController));
        });

        // DEVOPS iter-0008: AuthServer settings only exist in
        // appsettings.Development.json, so a non-Development boot used to
        // crash here with ArgumentNullException (Dictionary.Add with a
        // null audience key) before the host could start at all. Skip
        // the scope entry when no audience is configured, and skip the
        // swagger-OAuth registration when no authority is configured —
        // both guards only affect states that previously crashed, never
        // a working configuration. A real Production deployment must
        // still supply AuthServer settings plus Redis/YARP config.
        var swaggerScopes = new Dictionary<string, string>();
        var swaggerAudience = configuration["AuthServer:Audience"];
        if (!string.IsNullOrWhiteSpace(swaggerAudience))
        {
            swaggerScopes.Add(swaggerAudience, "Api Gateway API");
        }
        // DEVOPS iter-0008 (continued): the audience guard above exposed
        // the next layer of the same Production crash — ABP's
        // AddAbpSwaggerGenWithOAuth throws NullReferenceException when
        // AuthServer:Authority is null (it builds OAuth endpoints from
        // it). Skip ONLY this swagger-OAuth registration when no
        // authority is configured (everything below — JwtBearer auth,
        // DataProtection, CORS, YARP, health checks — still runs): a
        // gateway without an AuthServer cannot offer OAuth swagger
        // anyway, and skipping is strictly better than failing to
        // start. When authority IS configured (the only state that ever
        // worked), this block behaves exactly like the old code.
        var swaggerAuthority = configuration["AuthServer:Authority"];
        if (!string.IsNullOrWhiteSpace(swaggerAuthority))
        {
        context.Services.AddAbpSwaggerGenWithOAuth(
            authority: swaggerAuthority,
            scopes: swaggerScopes,
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "ApiGateway", Version = "v1" });
                options.DocInclusionPredicate((docName, description) => true);
                options.CustomSchemaIds(type => type.FullName);
            });
        }
        context.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    configuration.GetSection("AuthServer").Bind(options);
                });

        context.Services
            .AddDataProtection()
            .SetApplicationName("LINGYUN.Abp.Application")
            .PersistKeysToStackExchangeRedis(() =>
            {
                var redis = ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]!);

                return redis.GetDatabase();
            },
            "LINGYUN.Abp.Application:DataProtection:Protection-Keys");

        context.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                var corsOrigins = configuration.GetSection("App:CorsOrigins").Get<List<string>>();
                if (corsOrigins == null || corsOrigins.Count == 0)
                {
                    corsOrigins = configuration["App:CorsOrigins"]?
                        .Split(",", StringSplitOptions.RemoveEmptyEntries)
                        .Select(o => o.RemovePostFix("/"))
                        .ToList() ?? new List<string>();
                }

                builder
                    .WithOrigins(corsOrigins
                        .Select(o => o.RemovePostFix("/"))
                        .ToArray()
                    )
                    .WithAbpExposedHeaders()
                    .WithAbpWrapExposedHeaders()
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
        context.Services.AddWebSockets(options =>
        {

        });
        context.Services.AddHttpForwarder();
        context.Services.AddTelemetryListeners();

        context.Services
            .AddReverseProxy()
            .ConfigureHttpClient((context, handler) =>
            {
                handler.ActivityHeadersPropagator = null;
            })
            .LoadFromConfig(configuration.GetSection("ReverseProxy"));

        // DEVOPS iter-0006 (DEV-11): gateway truoc day khong co /healthz (chi co
        // /health cua Aspire, chi o Development, chi check "self" rong).
        // Map /healthz qua AbpEndpointRouter (hoat dong moi moi truong, nhu
        // cac microservice) + check Redis that (noi DataProtection phu thuoc).
        Configure<AbpEndpointRouterOptions>(options =>
        {
            options.EndpointConfigureActions.Add((builder) =>
            {
                builder.Endpoints.MapHealthChecks(configuration["App:HealthChecks"] ?? "/healthz");
            });
        });

        context.Services.AddHealthChecks()
            .AddCheck("redis", new HealthChecks.RedisHealthCheck(configuration["Redis:Configuration"]));
    }
}
