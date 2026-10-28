using DotNetCore.CAP;
using LINGYUN.Abp.AspNetCore.Session;
using LINGYUN.Abp.Dapr.Client.ClientProxying;
using LINGYUN.Abp.ExceptionHandling;
using LINGYUN.Abp.ExceptionHandling.Emailing;
using LINGYUN.Abp.Exporter.MiniSoftware;
using LINGYUN.Abp.Localization.CultureMap;
using LINGYUN.Abp.LocalizationManagement;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using LINGYUN.Abp.TextTemplating;
using LINGYUN.Abp.Wrapper;
using Medallion.Threading;
using Medallion.Threading.Redis;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.AntiForgery;
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
using Volo.Abp.Security.Claims;
using Volo.Abp.SettingManagement;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.VirtualFileSystem;

namespace PackageName.CompanyName.ProjectName;

public partial class ProjectNameHttpApiHostModule
{
    public static string ApplicationName { get; set; } = "ProjectNameService";
    private static readonly OneTimeRunner OneTimeRunner = new();

    private void PreConfigureFeature()
    {
        OneTimeRunner.Run(() =>
        {
            GlobalFeatureManager.Instance.Modules.Editions().EnableAll();
        });
    }

    private void PreConfigureApp()
    {
        AbpSerilogEnrichersConsts.ApplicationName = ApplicationName;

        PreConfigure<AbpSerilogEnrichersUniqueIdOptions>(options =>
        {
            // Phân biệt theo cổng đang mở
            options.SnowflakeIdOptions.WorkerId = 5;
            options.SnowflakeIdOptions.WorkerIdBits = 5;
            options.SnowflakeIdOptions.DatacenterId = 1;
        });
    }

    private void PreConfigureCAP(IConfiguration configuration)
    {
        PreConfigure<CapOptions>(options =>
        {
            options
#if MySQL
            .UseMySql(sqlOptions =>
            {
                configuration.GetSection("CAP:MySql").Bind(sqlOptions);
            })
#elif SqlServer
            .UseSqlServer(sqlOptions =>
            {
                configuration.GetSection("CAP:SqlServer").Bind(sqlOptions);
            })
#elif Sqlite
            .UseSqlite(sqlOptions =>
            {
                configuration.GetSection("CAP:Sqlite").Bind(sqlOptions);
            })
#elif Oracle || OracleDevart
            .UseOracle(sqlOptions =>
            {
                configuration.GetSection("CAP:Oracle").Bind(sqlOptions);
            })
#elif PostgreSql
            .UsePostgreSql(sqlOptions =>
            {
                configuration.GetSection("CAP:PostgreSql").Bind(sqlOptions);
            })
#endif
            .UseRabbitMQ(rabbitMQOptions =>
            {
                configuration.GetSection("CAP:RabbitMQ").Bind(rabbitMQOptions);
            })
            .UseDashboard();
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
        var distributedLockIsEnabled = configuration["DistributedLock:IsEnabled"];
        if (distributedLockIsEnabled.IsNullOrWhiteSpace() || bool.Parse(distributedLockIsEnabled))
        {
            services.AddSingleton<IDistributedLockProvider>(_ =>
            {
                return new RedisDistributedSynchronizationProvider(
                    ConnectionMultiplexer.Connect(configuration["DistributedLock:Redis:Configuration"]).GetDatabase());
            });
        }
    }
    private void ConfigureExceptionHandling()
    {
        // Tùy chỉnh các ngoại lệ cần xử lý
        Configure<AbpExceptionHandlingOptions>(options =>
        {
            //  Thêm các loại ngoại lệ cần xử lý
            options.Handlers.Add<Volo.Abp.Data.AbpDbConcurrencyException>();
            options.Handlers.Add<AbpInitializationException>();
            options.Handlers.Add<OutOfMemoryException>();
            options.Handlers.Add<System.Data.Common.DbException>();
            options.Handlers.Add<Microsoft.EntityFrameworkCore.DbUpdateException>();
            options.Handlers.Add<System.Data.DBConcurrencyException>();
        });
        // Tùy chỉnh các loại ngoại lệ cần gửi thông báo email
        Configure<AbpEmailExceptionHandlingOptions>(options =>
        {
            // Có gửi thông tin stack trace hay không
            options.SendStackTrace = true;
            // Email nhận mặc định khi chưa chỉ định người nhận ngoại lệ
            // Chỉ định địa chỉ email của riêng bạn
        });
    }

    private void ConfigureIdentity(IConfiguration configuration)
    {
        Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
            var refreshClaimsUrl = configuration["App:RefreshClaimsUrl"];
            if (!refreshClaimsUrl.IsNullOrWhiteSpace())
            {
                options.RemoteRefreshUrl = refreshClaimsUrl + options.RemoteRefreshUrl;
            }
        });
    }

    private void ConfigureAuditing(IConfiguration configuration)
    {
        Configure<AbpAuditingOptions>(options =>
        {
            options.ApplicationName = ApplicationName;
            // Có bật ghi lại thay đổi entity hay không
            var allEntitiesSelectorIsEnabled = configuration["Auditing:AllEntitiesSelector"];
            if (allEntitiesSelectorIsEnabled.IsNullOrWhiteSpace() || bool.Parse(allEntitiesSelectorIsEnabled))
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

        services.AddHealthChecks();
    }

    private void ConfigureMiniSoftware()
    {
        Configure<AbpExporterMiniExcelOptions>(options =>
        {
            // Cấu hình import/export MiniExcel
        });
        Configure<AbpExporterMiniWordOptions>(options =>
        {
            // Cấu hình import/export MiniWord
        });
    }

    private void ConfigureFeatureManagement(IConfiguration configuration)
    {
        if (configuration.GetValue("FeatureManagement:IsDynamicStoreEnabled", false))
        {
            Configure<FeatureManagementOptions>(options =>
            {
                options.SaveStaticFeaturesToDatabase = true;
                options.IsDynamicFeatureStoreEnabled = true;
            });
        }
    }

    private void ConfigurePermissionManagement(IConfiguration configuration)
    {
        if (configuration.GetValue("PermissionManagement:IsDynamicStoreEnabled", false))
        {
            Configure<PermissionManagementOptions>(options =>
            {
                options.SaveStaticPermissionsToDatabase = true;
                options.IsDynamicPermissionStoreEnabled = true;
            });
        }
    }

    private void ConfigureTextTemplatingManagement(IConfiguration configuration)
    {
        if (configuration.GetValue("TextTemplatingManagement:IsDynamicStoreEnabled", false))
        {
            Configure<AbpTextTemplatingCachingOptions>(options =>
            {
                options.SaveStaticTemplateDefinitionToDatabase = true;
                options.IsDynamicTemplateDefinitionStoreEnabled = true;
            });
        }
    }

    private void ConfigureSettingManagement(IConfiguration configuration)
    {
        if (configuration.GetValue("SettingManagement:IsDynamicStoreEnabled", false))
        {
            Configure<SettingManagementOptions>(options =>
            {
                options.SaveStaticSettingsToDatabase = true;
                options.IsDynamicSettingStoreEnabled = true;
            });
        }
    }

    private void ConfigureVirtualFileSystem()
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<ProjectNameHttpApiHostModule>("PackageName.CompanyName.ProjectName");
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

    private void ConfigureSwagger(IServiceCollection services, IConfiguration configuration, bool isDevelopment = false)
    {
        if (!isDevelopment)
        {
            return;
        }
        // Swagger
        services.AddAbpSwaggerGenWithOAuth(
            configuration["AuthServer:Authority"],
            new Dictionary<string, string>
            {
                { configuration["AuthServer:Audience"], "ProjectName API"}
            },
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ProjectName API",
                    Version = "v1",
                    Contact = new OpenApiContact
                    {
                        Name = "anonymous", // your name
                        Email = "anonymous@gmail.com", // your email
                        Url = new Uri("http://localhost/profile") // your profile
                    },
                    License = new OpenApiLicense
                    {
                        Name = "MIT",
                        Url = new Uri("https://licenses.nuget.org/MIT")
                    }
                });
                options.DocInclusionPredicate((docName, description) => true);
                options.CustomSchemaIds(type => type.FullName);
                options.DescribeAllParametersInCamelCase();
                options.TagActionsBy(api =>
                {
                    // Hiển thị theo nhóm controller
                    var groupName = api.GroupName ?? "Chưa phân nhóm";
                    var controllerName = api.ActionDescriptor.RouteValues["controller"];

                    // Tạo nhóm bằng tên controller và thông tin tóm tắt
                    return new[] { $"{groupName}/{controllerName}" };
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Scheme = "bearer",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT"
                });

                var currentPath = AppContext.BaseDirectory;
                var xmlDocFiles = Directory.GetFiles(currentPath, "PackageName.CompanyName.ProjectName.*.xml");
                xmlDocFiles.AddIfNotContains(Directory.GetFiles(AppContext.BaseDirectory, "Volo.Abp.*.xml"));

                foreach (var xmlDocFile in xmlDocFiles)
                {
                    options.IncludeXmlComments(xmlDocFile);
                }

                options.SchemaFilter<EnumDescriptionSchemaFilter>();
                options.OperationFilter<TenantHeaderParamter>();
                options.HideAbpEndpoints();
            });
    }

    private void ConfigureLocalization(IConfiguration configuration)
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

        if (configuration.GetValue("LocalizationManagement:IsDynamicStoreEnabled", false))
        {
            Configure<AbpLocalizationManagementOptions>(options =>
            {
                options.SaveStaticLocalizationsToDatabase = true;
            });
        }
    }

    private void ConfigureSecurity(IServiceCollection services, IConfiguration configuration, bool isDevelopment = false)
    {
        Configure<AbpAntiForgeryOptions>(options =>
        {
            configuration.GetSection("AntiForgery").Bind(options);
            // options.AutoValidate = false;
            // options.AutoValidateFilter = (type) => !type.Namespace.Contains("elsa", StringComparison.CurrentCultureIgnoreCase);
        });

        Configure<AbpAspNetCoreSessionOptions>(options =>
        {
            options.IsParseIpLocation = true;
        });

        if (isDevelopment)
        {
            // Môi trường phát triển có thể bỏ comment để tắt kiểm tra quyền
            // services.AddAlwaysAllowAuthorization();
            // Môi trường phát triển có thể bỏ comment để tắt kiểm tra phiên
            // services.AddAlwaysAllowSession();
        }

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

    private void ConfigureWrapper()
    {
        Configure<AbpWrapperOptions>(options =>
        {
            // Bỏ comment để đóng gói kết quả
            options.IsEnabled = true;
        });
    }

    private void PreConfigureWrapper()
    {
        PreConfigure<AbpHttpClientBuilderOptions>(options =>
        {
            // Gọi giữa các dịch vụ http gửi header không cần đóng gói kết quả
            options.ProxyClientActions.Add(
                (_, _, client) =>
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation(AbpHttpWrapConsts.AbpDontWrapResult, "true");
                });
        });

        PreConfigure<AbpDaprClientProxyOptions>(options =>
        {
            // Gọi giữa các dịch vụ dapr gửi header không cần đóng gói kết quả
            options.ProxyRequestActions.Add(
                (appId, httpRequestMessage) =>
                {
                    httpRequestMessage.Headers.TryAddWithoutValidation(AbpHttpWrapConsts.AbpDontWrapResult, "true");
                });
        });
    }
}
