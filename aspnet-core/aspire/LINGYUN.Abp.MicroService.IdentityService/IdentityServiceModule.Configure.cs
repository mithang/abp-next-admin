using DotNetCore.CAP;
using LINGYUN.Abp.Identity.Session;
using LINGYUN.Abp.Localization.CultureMap;
using LINGYUN.Abp.LocalizationManagement;
using LINGYUN.Abp.OpenIddict.Permissions;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using LINGYUN.Abp.Wrapper;
using Medallion.Threading;
using Medallion.Threading.Redis;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using StackExchange.Redis;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Auditing;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.BlobStoring;
using Volo.Abp.Caching;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Http.Client;
using Volo.Abp.Json;
using Volo.Abp.Json.SystemTextJson;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Security.Claims;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.MicroService.IdentityService;

public partial class IdentityServiceModule
{
    private readonly static OneTimeRunner OneTimeRunner = new OneTimeRunner();

    private void PreConfigureFeature()
    {
        OneTimeRunner.Run(() =>
        {
            GlobalFeatureManager.Instance.Modules.Editions().EnableAll();
        });
    }

    private void PreForwardedHeaders()
    {
    }

    private void PreConfigureApp(IConfiguration configuration)
    {
        PreConfigure<AbpSerilogEnrichersUniqueIdOptions>(options =>
        {
            // Phân biệt bằng cổng mở, phải nằm trong khoảng 0-31
            options.SnowflakeIdOptions.WorkerId = 15;
            options.SnowflakeIdOptions.WorkerIdBits = 5;
            options.SnowflakeIdOptions.DatacenterId = 1;
        });

        if (configuration.GetValue<bool>("App:ShowPii"))
        {
            IdentityModelEventSource.ShowPII = true;
        }
    }

    private void PreConfigureCAP(IConfiguration configuration)
    {
        PreConfigure<CapOptions>(options =>
        {
            options
                .UsePostgreSql(mySqlOptions =>
                {
                    configuration.GetSection("CAP:PostgreSql").Bind(mySqlOptions);
                })
                .UseRabbitMQ(rabbitMQOptions =>
                {
                    configuration.GetSection("CAP:RabbitMQ").Bind(rabbitMQOptions);
                })
                .UseDashboard();
        });
    }

    private void PreConfigureIdentity()
    {
        PreConfigure<IdentityBuilder>(builder =>
        {
            builder.AddDefaultTokenProviders();
        });
    }

    private void ConfigureBlobStoring(IConfiguration configuration)
    {
        Configure<AbpBlobStoringOptions>(options =>
        {
        });
    }

    private void ConfigureDbContext()
    {
        // Cấu hình Ef
        Configure<AbpDbContextOptions>(options =>
        {
            options.UseNpgsql();
        });
    }

    private void ConfigureJsonSerializer(IConfiguration configuration)
    {
        // Thống nhất định dạng ngày giờ
        Configure<AbpJsonOptions>(options =>
        {
            var jsonConfiguration = configuration.GetSection("Json");
            if (jsonConfiguration.Exists())
            {
                jsonConfiguration.Bind(options);
            }
        });
        // Vấn đề mã hóa khi tuần tự hóa tiếng Trung
        Configure<AbpSystemTextJsonSerializerOptions>(options =>
        {
            options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
        });
    }

    private void ConfigureFeatureManagement()
    {
        Configure<FeatureManagementOptions>(options =>
        {
            options.IsDynamicFeatureStoreEnabled = true;
        });
    }

    private void ConfigurePermissionManagement()
    {
        Configure<PermissionManagementOptions>(options =>
        {
            // Rename IdentityServer.Client.ManagePermissions
            // See https://github.com/abpframework/abp/blob/dev/modules/identityserver/src/Volo.Abp.PermissionManagement.Domain.IdentityServer/Volo/Abp/PermissionManagement/IdentityServer/AbpPermissionManagementDomainIdentityServerModule.cs
            options.ProviderPolicies[ClientPermissionValueProvider.ProviderName] = AbpOpenIddictPermissions.Applications.ManagePermissions;
            options.SaveStaticPermissionsToDatabase = false;
        });
    }

    private void ConfigureAuditing(IConfiguration configuration)
    {
        Configure<AbpAuditingOptions>(options =>
        {
            // Có bật ghi lại thay đổi thực thể hay không
            var allEntitiesSelectorIsEnabled = configuration["Auditing:AllEntitiesSelector"];
            if (allEntitiesSelectorIsEnabled.IsNullOrWhiteSpace() ||
                (bool.TryParse(allEntitiesSelectorIsEnabled, out var enabled) && enabled))
            {
                options.EntityHistorySelectors.AddAllEntities();
            }
        });
    }

    private void ConfigureUrls(IConfiguration configuration)
    {
        Configure<AppUrlOptions>(options =>
        {
            var applicationConfiguration = configuration.GetSection("App:Urls:Applications");
            foreach (var appConfig in applicationConfiguration.GetChildren())
            {
                options.Applications[appConfig.Key].RootUrl = appConfig["RootUrl"];
                foreach (var urlsConfig in appConfig.GetSection("Urls").GetChildren())
                {
                    options.Applications[appConfig.Key].Urls[urlsConfig.Key] = urlsConfig.Value;
                }
            }
        });
    }

    private void ConfigureDistributedLocking(IServiceCollection services, IConfiguration configuration)
    {
        var distributedLockEnabled = configuration["DistributedLock:IsEnabled"];
        if (distributedLockEnabled.IsNullOrEmpty() || bool.Parse(distributedLockEnabled))
        {
            services.AddSingleton<IDistributedLockProvider>(sp =>
            {
                var connectionMultiplexer = sp.GetRequiredService<IConnectionMultiplexer>();
                return new RedisDistributedSynchronizationProvider(connectionMultiplexer.GetDatabase());
            });
        }
    }

    private void ConfigureTiming(IConfiguration configuration)
    {
        Configure<AbpClockOptions>(options =>
        {
            configuration.GetSection("Clock").Bind(options);
        });
    }

    private void ConfigureCaching(IConfiguration configuration)
    {
        Configure<AbpDistributedCacheOptions>(options =>
        {
            configuration.GetSection("DistributedCache").Bind(options);
        });

        Configure<AbpDistributedEntityEventOptions>(options =>
        {
            options.AutoEventSelectors.AddNamespace("Volo.Abp.Identity");
            options.AutoEventSelectors.AddNamespace("Volo.Abp.OpenIddict");
        });

        Configure<RedisCacheOptions>(options =>
        {
            var redisConfig = ConfigurationOptions.Parse(options.Configuration);
            options.ConfigurationOptions = redisConfig;
            options.InstanceName = configuration["Redis:InstanceName"];
        });
    }

    private void ConfigureMvc(IServiceCollection services, IConfiguration configuration)
    {
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ExposeIntegrationServices = true;
        });

        Configure<AbpEndpointRouterOptions>(options =>
        {
            options.EndpointConfigureActions.Add((builder) =>
            {
                builder.Endpoints.MapHealthChecks(configuration["App:HealthChecks"] ?? "/healthz");
            });
        });

        // DEVOPS iter-0006 (DEV-11): /healthz truoc day tro trui (AddHealthChecks()
        // khong check nao) nen luon 200 ke ca khi DB/Redis chet. Dang ky check
        // dependency that tai day; xem HealthChecks/IdentityServiceHealthChecks.cs. Quet DbContext tu
        // IServiceCollection: ABP chay ConfigureServices cua module phu thuoc truoc
        // module host, nen luc ConfigureMvc chay thi cac DbContext da duoc dang ky.
        var dbContextTypes = services
            .Where(s => s.ServiceType.IsClass && !s.ServiceType.IsAbstract
                && typeof(DbContext).IsAssignableFrom(s.ServiceType))
            .Select(s => s.ServiceType)
            .Distinct()
            .ToList();
        services.AddSingleton(sp => new HealthChecks.DatabaseHealthCheck(
            dbContextTypes,
            sp.GetRequiredService<IServiceScopeFactory>(),
            sp.GetService<ILogger<HealthChecks.DatabaseHealthCheck>>()));
        services.AddHealthChecks()
            .AddCheck<HealthChecks.DatabaseHealthCheck>("database")
            .AddCheck("redis", new HealthChecks.RedisHealthCheck(configuration["Redis:Configuration"]));    }

    private void ConfigureVirtualFileSystem()
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<IdentityServiceModule>("LINGYUN.Abp.MicroService.IdentityService");
        });
    }

    private void ConfigureMultiTenancy(IConfiguration configuration)
    {
        // Đa tenant
        Configure<AbpMultiTenancyOptions>(options =>
        {
            options.IsEnabled = true;
        });

        var tenantResolveCfg = configuration.GetSection("App:Domains");
        if (tenantResolveCfg.Exists())
        {
            Configure<AbpTenantResolveOptions>(options =>
            {
                var domains = tenantResolveCfg.Get<string[]>();
                foreach (var domain in domains)
                {
                    options.AddDomainTenantResolver(domain);
                }
            });
        }
    }

    private void ConfigureIdentity()
    {
        Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
        Configure<IdentitySessionCleanupOptions>(options =>
        {
            options.IsCleanupEnabled = true;
        });
    }

    private void ConfigureSwagger(IServiceCollection services, IConfiguration configuration)
    {
        // Swagger
        // DEVOPS iter-0009: same Production-boot guard as ApiGatewayModule
        // (iter-0008). AuthServer settings only exist in
        // appsettings.Development.json, so a non-Development boot used to
        // crash here with ArgumentNullException (Dictionary.Add with a null
        // audience key), and AddAbpSwaggerGenWithOAuth throws
        // NullReferenceException when AuthServer:Authority is null. Skip the
        // scope entry when no audience is configured, and skip the whole
        // registration when no authority is configured; both guards only
        // affect states that previously crashed, never a working config.
        var swaggerScopes = new Dictionary<string, string>();
        var swaggerAudience = configuration["AuthServer:Audience"];
        if (!string.IsNullOrWhiteSpace(swaggerAudience))
        {
            swaggerScopes.Add(swaggerAudience, "Identity Service API");
        }
        var swaggerAuthority = configuration["AuthServer:Authority"];
        if (!string.IsNullOrWhiteSpace(swaggerAuthority))
        {
        services.AddAbpSwaggerGenWithOAuth(
            swaggerAuthority,
            swaggerScopes,
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Identity Service API", Version = "v1",
                    Contact = new OpenApiContact
                    {
                        Name = "colin",
                        Email = "colin.in@foxmail.com",
                        Url = new Uri("https://github.com/colinin")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "MIT",
                        Url = new Uri("https://github.com/colinin/abp-next-admin/blob/master/LICENSE")
                    }
                });
                options.DocInclusionPredicate((docName, description) => true);
                options.CustomSchemaIds(type => type.FullName);
                options.DescribeAllParametersInCamelCase();

                var xmlDocFiles = new List<string>();
                xmlDocFiles.AddIfNotContains(Directory.GetFiles(AppContext.BaseDirectory, "LINGYUN.Abp.*.xml"));
                xmlDocFiles.AddIfNotContains(Directory.GetFiles(AppContext.BaseDirectory, "Volo.Abp.*.xml"));

                foreach (var xmlDocFile in xmlDocFiles)
                {
                    options.IncludeXmlComments(xmlDocFile);
                }

                options.SchemaFilter<EnumDescriptionSchemaFilter>();
                options.OperationFilter<TenantHeaderParamter>();
            });
        }
    }

    private void ConfigureLocalization()
    {
        // Hỗ trợ các loại ngôn ngữ bản địa hóa
        Configure<AbpLocalizationOptions>(options =>
        {
            options.Languages.Add(new LanguageInfo("en", "en", "English"));
            options.Languages.Add(new LanguageInfo("zh-Hans", "zh-Hans", "Tiếng Trung giản thể"));
        });

        Configure<AbpLocalizationCultureMapOptions>(options =>
        {
            var zhHansCultureMapInfo = new CultureMapInfo
            {
                TargetCulture = "zh-Hans",
                SourceCultures = new string[] { "zh", "zh_CN", "zh-CN" }
            };

            options.CulturesMaps.Add(zhHansCultureMapInfo);
            options.UiCulturesMaps.Add(zhHansCultureMapInfo);
        });

        Configure<AbpLocalizationManagementOptions>(options =>
        {
            options.SaveStaticLocalizationsToDatabase = true;
        });
    }

    private void ConfigureCors(IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
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
    }

    private void ConfigureSecurity(IServiceCollection services, IConfiguration configuration, bool isDevelopment = false)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddAbpJwtBearer(options =>
            {
                configuration.GetSection("AuthServer").Bind(options);

                var validIssuers = configuration.GetSection("AuthServer:ValidIssuers").Get<List<string>>();
                if (validIssuers?.Count > 0)
                {
                    options.TokenValidationParameters.ValidIssuers = validIssuers;
                    options.TokenValidationParameters.IssuerValidator = TokenWildcardIssuerValidator.IssuerValidator;
                }
                var validAudiences = configuration.GetSection("AuthServer:ValidAudiences").Get<List<string>>();
                if (validAudiences?.Count > 0)
                {
                    options.TokenValidationParameters.ValidAudiences = validAudiences;
                }
            });

        services
            .AddDataProtection()
            .SetApplicationName("LINGYUN.Abp.Application")
            .PersistKeysToStackExchangeRedis(() =>
            {
                var redis = ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]!);

                return redis.GetDatabase();
            },
            "LINGYUN.Abp.Application:DataProtection:Protection-Keys");
    }

    private void ConfigureWrapper()
    {
        Configure<AbpWrapperOptions>(options =>
        {
            options.IsEnabled = true;
        });
    }

    private void PreConfigureWrapper()
    {
        // Gọi giữa các service không đóng gói kết quả
        PreConfigure<AbpHttpClientBuilderOptions>(options =>
        {
            options.ProxyClientActions.Add(
                (_, _, client) =>
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation(AbpHttpWrapConsts.AbpDontWrapResult, "true");
                });
        });
    }
}
