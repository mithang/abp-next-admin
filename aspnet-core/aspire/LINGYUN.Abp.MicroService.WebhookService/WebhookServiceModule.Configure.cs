using DotNetCore.CAP;
using LINGYUN.Abp.BackgroundTasks;
using LINGYUN.Abp.Localization.CultureMap;
using LINGYUN.Abp.LocalizationManagement;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using LINGYUN.Abp.Webhooks;
using LINGYUN.Abp.Webhooks.BackgroundJobs;
using LINGYUN.Abp.WebhooksManagement;
using LINGYUN.Abp.Wrapper;
using Medallion.Threading;
using Medallion.Threading.Redis;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Quartz;
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
using Volo.Abp.Caching;
using Volo.Abp.FeatureManagement;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Http.Client;
using Volo.Abp.Json;
using Volo.Abp.Json.SystemTextJson;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Quartz;
using Volo.Abp.Security.Claims;
using Volo.Abp.SettingManagement;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.MicroService.WebhookService;

public partial class WebhookServiceModule
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

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
            // Phân biệt bằng cổng mở
            options.SnowflakeIdOptions.WorkerId = 28;
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
                .UsePostgreSql(sqlOptions =>
                {
                    configuration.GetSection("CAP:PostgreSql").Bind(sqlOptions);
                })
                .UseRabbitMQ(rabbitMQOptions =>
                {
                    configuration.GetSection("CAP:RabbitMQ").Bind(rabbitMQOptions);
                })
                .UseDashboard();
        });
    }

    private void PreConfigureQuartz(IConfiguration configuration)
    {
        PreConfigure<AbpQuartzOptions>(options =>
        {
            // Nếu dùng lưu trữ bền vững thì cấu hình tầng bền vững quartz
            if (configuration.GetSection("Quartz:UsePersistentStore").Get<bool>())
            {
                var settings = configuration.GetSection("Quartz:Properties").Get<Dictionary<string, string>>();
                if (settings != null)
                {
                    foreach (var setting in settings)
                    {
                        options.Properties[setting.Key] = setting.Value;
                    }
                }

                options.Configurator += (config) =>
                {
                    config.UsePersistentStore(store =>
                    {
                        store.UseProperties = false;
                        store.UseNewtonsoftJsonSerializer();
                    });
                };
            }
        });
    }

    private void ConfigureBackgroundTasks(IServiceCollection services, IConfiguration configuration)
    {
        var webhooksOptions = services.ExecutePreConfiguredActions<AbpWebhooksOptions>();

        Configure<AbpBackgroundTasksOptions>(options =>
        {
            var applicationName = services.GetApplicationName();
            options.NodeName = applicationName;

            options.JobDispatcherSelectors.AddJob<WebhookSenderJob>(
                job =>
                {
                    job.NodeName = applicationName;
                    // Cần kiểm soát khoảng thời gian
                    job.Interval = 10;
                    job.MaxCount = webhooksOptions.MaxSendAttemptCount;
                    job.MaxTryCount = webhooksOptions.MaxSendAttemptCount;
                    // Cần khóa job
                    job.LockTimeOut = webhooksOptions.TimeoutDuration.TotalSeconds.To<int>();
                    if (webhooksOptions.IsAutomaticSubscriptionDeactivationEnabled)
                    {
                        job.MaxCount = webhooksOptions.MaxConsecutiveFailCountBeforeDeactivateSubscription;
                    }
                });
            //options.JobDispatcherSelectors.AddNamespace(
            //    "LINGYUN.Abp.Webhooks.BackgroundJobs",
            //    job =>
            //    {
            //        // more
            //    });
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
        // Vấn đề mã hóa khi serialize tiếng Trung
        Configure<AbpSystemTextJsonSerializerOptions>(options =>
        {
            options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
        });
    }

    private void ConfigureDistributedLock(IServiceCollection services, IConfiguration configuration)
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

    private void ConfigureAuditing(IConfiguration configuration)
    {
        Configure<AbpAuditingOptions>(options =>
        {
            // Có bật ghi lại thay đổi thực thể không
            var allEntitiesSelectorIsEnabled = configuration["Auditing:AllEntitiesSelector"];
            if (allEntitiesSelectorIsEnabled.IsNullOrWhiteSpace() ||
                (bool.TryParse(allEntitiesSelectorIsEnabled, out var enabled) && enabled))
            {
                options.EntityHistorySelectors.AddAllEntities();
            }
        });
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
        // dependency that tai day; xem HealthChecks/WebhookServiceHealthChecks.cs. Quet DbContext tu
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
            options.FileSets.AddEmbedded<WebhookServiceModule>("LINGYUN.Abp.MicroService.WebhookService");
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
                var domains = tenantResolveCfg.Get<string[]>() ?? [];
                foreach (var domain in domains)
                {
                    options.AddDomainTenantResolver(domain);
                }
            });
        }
    }

    private void ConfigureIdentity(IConfiguration configuration)
    {
        Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
            options.RemoteRefreshUrl = configuration["App:RefreshClaimsUrl"] + options.RemoteRefreshUrl;
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
            swaggerScopes.Add(swaggerAudience, "Webhook Service API");
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
                    Title = "Webhook Service API", Version = "v1",
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
            options.IsDynamicPermissionStoreEnabled = true;
            options.SaveStaticPermissionsToDatabase = false;
        });
    }

    private void ConfigureSettingManagement()
    {
        Configure<SettingManagementOptions>(options =>
        {
            options.IsDynamicSettingStoreEnabled = true;
        });
    }

    private void ConfigureWebhooks(IServiceCollection services)
    {
        Configure<WebhooksManagementOptions>(options =>
        {
            // Bật dynamic webhook trong ứng dụng host
            options.IsDynamicWebhookStoreEnabled = true;
        });

        // Dùng publisher mặc định trong ứng dụng host
        services.Replace(ServiceDescriptor.Transient<IWebhookPublisher, DefaultWebhookPublisher>());
    }

    private void ConfigureLocalization()
    {
        // Hỗ trợ loại ngôn ngữ bản địa hóa
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
        // Cuộc gọi giữa các dịch vụ không bọc kết quả
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
