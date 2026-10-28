using DotNetCore.CAP;
using Elsa;
using Elsa.Options;
using Elsa.Rebus.RabbitMq;
using LINGYUN.Abp.BackgroundTasks;
using LINGYUN.Abp.ExceptionHandling;
using LINGYUN.Abp.ExceptionHandling.Emailing;
using LINGYUN.Abp.Localization.CultureMap;
using LINGYUN.Abp.LocalizationManagement;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using Medallion.Threading;
using Medallion.Threading.Redis;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
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
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.AntiForgery;
using Volo.Abp.Auditing;
using Volo.Abp.BlobStoring;
using Volo.Abp.Caching;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Json;
using Volo.Abp.Json.SystemTextJson;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Quartz;
using Volo.Abp.Security.Claims;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.VirtualFileSystem;
using ConsoleStartup = Elsa.Activities.Console.Startup;
using EmailStartup = Elsa.Activities.Email.Startup;
using HttpStartup = Elsa.Activities.Http.Startup;
using JavaScriptStartup = Elsa.Scripting.JavaScript.Startup;
using TemporalQuartzStartup = Elsa.Activities.Temporal.Quartz.Startup;
using UserTaskStartup = Elsa.Activities.UserTask.Startup;
using WebhooksApiEndpoints = Elsa.Webhooks.Api.Endpoints.List;
using WebhooksStartup = LINGYUN.Abp.Elsa.Activities.Webhooks.Startup;

namespace LINGYUN.Abp.MicroService.WorkflowService;

public partial class WorkflowServiceModule
{
    public static string ApplicationName { get; set; } = "WorkflowService";
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

    private void PreConfigureFeature()
    {
        OneTimeRunner.Run(() =>
        {
            GlobalFeatureManager.Instance.Modules.Editions().EnableAll();
        });
    }

    private void PreConfigureForwardedHeaders()
    {
    }

    private void PreConfigureApp(IConfiguration configuration)
    {
        AbpSerilogEnrichersConsts.ApplicationName = ApplicationName;

        PreConfigure<AbpSerilogEnrichersUniqueIdOptions>(options =>
        {
            // Phân biệt bằng cổng mở
            options.SnowflakeIdOptions.WorkerId = 29;
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
            .UseMySql(mySqlOptions =>
            {
                configuration.GetSection("CAP:MySql").Bind(mySqlOptions);
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
            // Nếu dùng lưu trữ bền vững thì cấu hình tầng bền vững của Quartz
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

    private void ConfigureBackgroundTasks(IConfiguration configuration)
    {
        Configure<AbpBackgroundTasksOptions>(options =>
        {
            options.NodeName = ApplicationName;
        });
    }

    private void PreConfigureElsa(IServiceCollection services, IConfiguration configuration)
    {
        var elsaSection = configuration.GetSection("Elsa");
        var startups = new[]
            {
                typeof(ConsoleStartup),
                typeof(HttpStartup),
                typeof(UserTaskStartup),
                typeof(TemporalQuartzStartup),
                typeof(EmailStartup),
                typeof(JavaScriptStartup),
                typeof(WebhooksStartup),
            };

        PreConfigure<ElsaOptionsBuilder>(elsa =>
        {
            elsa
                .AddActivitiesFrom<WorkflowServiceModule>()
                .AddWorkflowsFrom<WorkflowServiceModule>()
                .AddFeatures(startups, configuration)
                .ConfigureWorkflowChannels(options => elsaSection.GetSection("WorkflowChannels").Bind(options))
                .UseRabbitMq(elsaSection["Rebus:RabbitMQ:Connection"]);

            elsa.DistributedLockingOptionsBuilder
                .UseProviderFactory(sp => name =>
                {
                    var provider = sp.GetRequiredService<IDistributedLockProvider>();

                    return provider.CreateLock(name);
                });
        });

        services.AddNotificationHandlersFrom<WorkflowServiceModule>();

        PreConfigure<IMvcBuilder>(mvcBuilder =>
        {
            mvcBuilder.AddApplicationPartIfNotExists(typeof(WebhooksApiEndpoints).Assembly);
        });
    }

    private void ConfigureEndpoints(IServiceCollection services)
    {
        // Không cần
        //Configure<AbpEndpointRouterOptions>(options =>
        //{
        //    options.EndpointConfigureActions.Add(
        //        (context) =>
        //        {
        //            context.Endpoints.MapFallbackToPage("/_Host");
        //        });
        //});
        var preActions = services.GetPreConfigureActions<AbpAspNetCoreMvcOptions>();

        services.AddAbpApiVersioning(options =>
        {
            options.ReportApiVersions = true;
            options.AssumeDefaultVersionWhenUnspecified = true;

            //options.ApiVersionReader = new HeaderApiVersionReader("api-version"); //Supports header too
            //options.ApiVersionReader = new MediaTypeApiVersionReader(); //Supports accept header too
        }, mvcOptions =>
        {
            mvcOptions.ConfigureAbp(preActions.Configure());
        });
    }

    private void ConfigureDistributedLock(IServiceCollection services, IConfiguration configuration)
    {
        var distributedLockEnabled = configuration["DistributedLock:IsEnabled"];
        if (distributedLockEnabled.IsNullOrEmpty() || bool.Parse(distributedLockEnabled))
        {
            services.AddSingleton<IDistributedLockProvider>(_ =>
            {
                return new RedisDistributedSynchronizationProvider(
                    ConnectionMultiplexer.Connect(configuration["DistributedLock:Redis:Configuration"]).GetDatabase());
            });
        }
    }

    private void ConfigureBlobStoring(IServiceCollection services, IConfiguration configuration)
    {
        var preActions = services.GetPreConfigureActions<AbpBlobStoringOptions>();
        Configure<AbpBlobStoringOptions>(options =>
        {
            preActions.Configure(options);
        });
    }

    private void ConfigureDbContext()
    {
        // Cấu hình EF
        Configure<AbpDbContextOptions>(options =>
        {
            options.UseMySQL(mysql =>
            {
                // see: https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql/issues/1960
                mysql.UseParameterizedCollectionMode(ParameterTranslationMode.Constant);
            });
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
        // Vấn đề mã hóa serialize tiếng Trung
        Configure<AbpSystemTextJsonSerializerOptions>(options =>
        {
            options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
        });
    }

    private void ConfigureExceptionHandling()
    {
        // Tùy chỉnh các exception cần xử lý
        Configure<AbpExceptionHandlingOptions>(options =>
        {
            //  Thêm các loại exception cần xử lý
            options.Handlers.Add<Volo.Abp.Data.AbpDbConcurrencyException>();
            options.Handlers.Add<AbpInitializationException>();
            options.Handlers.Add<OutOfMemoryException>();
            options.Handlers.Add<System.Data.Common.DbException>();
            options.Handlers.Add<Microsoft.EntityFrameworkCore.DbUpdateException>();
            options.Handlers.Add<System.Data.DBConcurrencyException>();
        });
        // Tùy chỉnh các loại exception cần gửi email thông báo
        Configure<AbpEmailExceptionHandlingOptions>(options =>
        {
            // Có gửi thông tin stack trace hay không
            options.SendStackTrace = true;
            // Email nhận mặc định khi chưa chỉ định người nhận exception
            // Chỉ định địa chỉ email của mình
        });
    }

    private void ConfigureAuditing(IConfiguration configuration)
    {
        Configure<AbpAuditingOptions>(options =>
        {
            options.ApplicationName = ApplicationName;
            // Có bật ghi lại thay đổi thực thể hay không
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
        // dependency that tai day; xem HealthChecks/WorkflowServiceHealthChecks.cs. Quet DbContext tu
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
            .AddCheck("redis", new HealthChecks.RedisHealthCheck(configuration["Redis:Configuration"]));
    }

    private void ConfigureVirtualFileSystem()
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<WorkflowServiceModule>("LINGYUN.Abp.WorkflowManagement");
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
        services.AddAbpSwaggerGenWithOAuth(
            configuration["AuthServer:Authority"],
            new Dictionary<string, string>
            {
                { configuration["AuthServer:Audience"], "Workflow Service API"}
            },
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Workflow Service API", Version = "v1",
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
                options.DocInclusionPredicate((docName, description) =>
                {
                    if (description.TryGetMethodInfo(out var methodInfo))
                    {
                        var controllerNamespace = methodInfo.DeclaringType?.Namespace;
                        if (controllerNamespace?.StartsWith("Elsa") == true)
                        {
                            // TODO: Elsa 2.x dùng Swashbuckle 6.x không tương thích, bỏ qua tài liệu Swagger
                            return false;
                        }
                    }

                    return true;
                });
                options.CustomSchemaIds(type => type.FullName);
                options.DescribeAllParametersInCamelCase();

                var xmlDocFiles = new List<string>();
                xmlDocFiles.AddIfNotContains(Directory.GetFiles(AppContext.BaseDirectory, "LINGYUN.Abp.*.xml"));
                xmlDocFiles.AddIfNotContains(Directory.GetFiles(AppContext.BaseDirectory, "Volo.Abp.*.xml"));

                foreach (var xmlDocFile in xmlDocFiles)
                {
                    options.IncludeXmlComments(xmlDocFile);
                }

                options.OperationFilter<TenantHeaderParamter>();
            });
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

    private void ConfigureSecurity(IServiceCollection services, IConfiguration configuration, bool isDevelopment = false)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddAbpJwtBearer(options =>
            {
                configuration.GetSection("AuthServer").Bind(options);

                var validIssuers = configuration.GetSection("AuthServer:ValidIssuers").Get<List<string>>();
                var validAudiences = configuration.GetSection("AuthServer:ValidAudiences").Get<List<string>>();
                if (validIssuers?.Count > 0)
                {
                    options.TokenValidationParameters.ValidIssuers = validIssuers;
                    options.TokenValidationParameters.IssuerValidator = TokenWildcardIssuerValidator.IssuerValidator;
                    options.TokenValidationParameters.IssuerValidatorUsingConfiguration = TokenWildcardIssuerValidator.IssuerValidatorUsingConfiguration;
                }
                if (validAudiences?.Count > 0)
                {
                    options.TokenValidationParameters.ValidAudiences = validAudiences;
                }
            });

        Configure<AbpAntiForgeryOptions>(options =>
        {
            configuration.GetSection("AntiForgery").Bind(options);
        });

        services.AddDataProtection()
            .SetApplicationName("LINGYUN.Abp.Application")
            .PersistKeysToStackExchangeRedis(() =>
            {
                return ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]).GetDatabase();
            },
            "LINGYUN.Abp.Application:DataProtection:Protection-Keys");
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
}
