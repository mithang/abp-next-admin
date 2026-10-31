using Elsa;
using Elsa.Options;
using Hangfire;
using Hangfire.Redis.StackExchange;
using LINGYUN.Abp.Aliyun.Localization;
using LINGYUN.Abp.ExceptionHandling;
using LINGYUN.Abp.ExceptionHandling.Emailing;
using LINGYUN.Abp.Exporter.MiniExcel;
using LINGYUN.Abp.Idempotent;
using LINGYUN.Abp.Identity.Session;
using LINGYUN.Abp.IdentityServer.IdentityResources;
using LINGYUN.Abp.Localization.CultureMap;
using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.OpenIddict.AspNetCore.Session;
using LINGYUN.Abp.OpenIddict.LinkUser;
using LINGYUN.Abp.OpenIddict.Permissions;
using LINGYUN.Abp.OpenIddict.Portal;
using LINGYUN.Abp.OpenIddict.Sms;
using LINGYUN.Abp.OpenIddict.WeChat;
using LINGYUN.Abp.Saas;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using LINGYUN.Abp.Tencent.Localization;
using LINGYUN.Abp.TextTemplating;
using LINGYUN.Abp.WebhooksManagement;
using LINGYUN.Abp.WeChat.Common.Messages.Handlers;
using LINGYUN.Abp.WeChat.Localization;
using LINGYUN.Abp.WeChat.Work;
using LINGYUN.Abp.Wrapper;
using LINGYUN.Platform.Localization;
using PackageName.CompanyName.ProjectName.AIO.Host.Microsoft.Extensions.DependencyInjection;
using Medallion.Threading;
using Medallion.Threading.Redis;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;
using OpenIddict.Server;
using OpenIddict.Server.AspNetCore;
using PackageName.CompanyName.ProjectName.AIO.Host.Authentication;
using PackageName.CompanyName.ProjectName.AIO.Host.IdentityResources;
using PackageName.CompanyName.ProjectName.AIO.Host.WeChat.Official.Messages;
using StackExchange.Redis;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.AntiForgery;
using Volo.Abp.AspNetCore.Mvc.Libs;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.Auditing;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.BlobStoring;
using Volo.Abp.BlobStoring.FileSystem;
using Volo.Abp.Caching;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Http.Client;
using Volo.Abp.Identity.Localization;
using Volo.Abp.IdentityServer;
using Volo.Abp.IdentityServer.Localization;
using Volo.Abp.Json;
using Volo.Abp.Json.SystemTextJson;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.OpenIddict;
using Volo.Abp.OpenIddict.Localization;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Security.Claims;
using Volo.Abp.SettingManagement;
using Volo.Abp.SettingManagement.Localization;
using Volo.Abp.Threading;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.VirtualFileSystem;
using PackageName.CompanyName.ProjectName.EntityFrameworkCore;
using VoloAbpExceptionHandlingOptions = Volo.Abp.AspNetCore.ExceptionHandling.AbpExceptionHandlingOptions;

namespace PackageName.CompanyName.ProjectName.AIO.Host;

public partial class MicroServiceApplicationsSingleModule
{
    protected const string DefaultCorsPolicyName = "Default";
    public static string ApplicationName { get; set; } = "MicroService-Applications-Single";
    private readonly static OneTimeRunner OneTimeRunner = new();

    private void PreConfigureFeature()
    {
        OneTimeRunner.Run(() =>
        {
            GlobalFeatureManager.Instance.Modules.Editions().EnableAll();
        });
    }

    private void PreConfigureApp(IConfiguration configuration)
    {
        AbpSerilogEnrichersConsts.ApplicationName = ApplicationName;

        PreConfigure<AbpSerilogEnrichersUniqueIdOptions>(options =>
        {
            // Phân biệt bằng cổng mở, phải nằm trong khoảng 0-31
            options.SnowflakeIdOptions.WorkerId = 1;
            options.SnowflakeIdOptions.WorkerIdBits = 5;
            options.SnowflakeIdOptions.DatacenterId = 1;
        });

        if (configuration.GetValue<bool>("App:ShowPii"))
        {
            IdentityModelEventSource.ShowPII = true;
        }
    }

    private void PreConfigureAuthServer(IConfiguration configuration)
    {
        PreConfigure<OpenIddictBuilder>(builder =>
        {
            builder.AddValidation(options =>
            {
                //options.AddAudiences("lingyun-abp-application");

                options.UseLocalServer();

                options.UseAspNetCore();

                options.UseDataProtection();
            });
        });
    }

    private void PreConfigureIdentity()
    {
        PreConfigure<IdentityBuilder>(builder =>
        {
            builder.AddDefaultTokenProviders();
        });
    }

    private void PreConfigureCertificate(IConfiguration configuration, IWebHostEnvironment environment)
    {
        var cerConfig = configuration.GetSection("Certificates");
        if (environment.IsProduction() && cerConfig.Exists())
        {
            // Môi trường phát triển có cấu hình chứng chỉ
            // Và nếu tệp chứng chỉ tồn tại thì dùng tệp chứng chỉ tùy chỉnh để khởi động máy chủ Ids
            var cerPath = Path.Combine(environment.ContentRootPath, cerConfig["CerPath"]);
            if (File.Exists(cerPath))
            {
                var certificate = new X509Certificate2(cerPath, cerConfig["Password"]);

                if (configuration.GetValue<bool>("AuthServer:UseOpenIddict"))
                {
                    PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
                    {
                        //https://documentation.openiddict.com/configuration/encryption-and-signing-credentials.html
                        options.AddDevelopmentEncryptionAndSigningCertificate = false;
                    });

                    PreConfigure<OpenIddictServerBuilder>(builder =>
                    {
                        builder.AddSigningCertificate(certificate);
                        builder.AddEncryptionCertificate(certificate);

                        builder.UseDataProtection();

                        // SEC-03 (vòng security 7): KHÔNG tắt yêu cầu transport security
                        // ở nhánh production này. Trước đây nhánh production vẫn gọi
                        // DisableTransportSecurityRequirement(), nên token endpoint
                        // chấp nhận HTTP thuần ngay cả khi đã có chứng chỉ production.
                        // Production phải phục vụ qua HTTPS (hoặc sau TLS terminator
                        // với ForwardedHeaders).
                    });
                }
                else
                {
                    PreConfigure<AbpIdentityServerBuilderOptions>(options =>
                    {
                        options.AddDeveloperSigningCredential = false;
                    });

                    PreConfigure<IIdentityServerBuilder>(builder =>
                    {
                        builder.AddSigningCredential(certificate);
                    });
                }
            }
        }
        else
        {
            if (configuration.GetValue<bool>("AuthServer:UseOpenIddict"))
            {
                PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
                {
                    //https://documentation.openiddict.com/configuration/encryption-and-signing-credentials.html
                    options.AddDevelopmentEncryptionAndSigningCertificate = false;
                });

                PreConfigure<OpenIddictServerBuilder>(builder =>
                {
                    //https://documentation.openiddict.com/configuration/encryption-and-signing-credentials.html
                    using (var algorithm = RSA.Create(keySizeInBits: 2048))
                    {
                        var subject = new X500DistinguishedName("CN=Fabrikam Encryption Certificate");
                        var request = new CertificateRequest(subject, algorithm, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                        request.CertificateExtensions.Add(new X509KeyUsageExtension(X509KeyUsageFlags.DigitalSignature, critical: true));
                        var certificate = request.CreateSelfSigned(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddYears(2));
                        builder.AddSigningCertificate(certificate);
                    }

                    using (var algorithm = RSA.Create(keySizeInBits: 2048))
                    {
                        var subject = new X500DistinguishedName("CN=Fabrikam Signing Certificate");
                        var request = new CertificateRequest(subject, algorithm, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                        request.CertificateExtensions.Add(new X509KeyUsageExtension(X509KeyUsageFlags.KeyEncipherment, critical: true));
                        var certificate = request.CreateSelfSigned(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddYears(2));
                        builder.AddEncryptionCertificate(certificate);
                    }

                    builder.UseDataProtection();

                    // Vô hiệu hóa https
                    builder.UseAspNetCore()
                        .DisableTransportSecurityRequirement();
                });
            }
        }
    }

    private void PreConfigureElsa(IServiceCollection services, IConfiguration configuration)
    {
        var elsaSection = configuration.GetSection("Elsa");
        var startups = new[]
            {
                typeof(Elsa.Activities.Console.Startup),
                typeof(Elsa.Activities.Http.Startup),
                typeof(Elsa.Activities.UserTask.Startup),
                typeof(Elsa.Activities.Temporal.Quartz.Startup),
                typeof(Elsa.Activities.Email.Startup),
                typeof(Elsa.Scripting.JavaScript.Startup),
                typeof(Elsa.Activities.Webhooks.Startup),
            };

        PreConfigure<ElsaOptionsBuilder>(elsa =>
        {
            elsa
                .AddActivitiesFrom<MicroServiceApplicationsSingleModule>()
                .AddWorkflowsFrom<MicroServiceApplicationsSingleModule>()
                .AddFeatures(startups, configuration)
                .ConfigureWorkflowChannels(options => elsaSection.GetSection("WorkflowChannels").Bind(options));

            elsa.DistributedLockingOptionsBuilder
                .UseProviderFactory(sp => name =>
                {
                    var provider = sp.GetRequiredService<IDistributedLockProvider>();

                    return provider.CreateLock(name);
                });
        });

        services.AddNotificationHandlersFrom<MicroServiceApplicationsSingleModule>();

        PreConfigure<IMvcBuilder>(mvcBuilder =>
        {
            mvcBuilder.AddApplicationPartIfNotExists(typeof(Elsa.Webhooks.Api.Endpoints.List).Assembly);
        });
    }

    private void ConfigureAuthServer(IConfiguration configuration, IWebHostEnvironment environment)
    {
        // SEC-03 (vòng security 7): chỉ tắt yêu cầu transport security khi Development.
        // Trước đây tắt vô điều kiện, nên project scaffold từ template này sẽ chấp
        // nhận token endpoint qua HTTP thuần ngay cả ở production.
        if (environment.IsDevelopment())
        {
            Configure<OpenIddictServerAspNetCoreBuilder>(builder =>
            {
                builder.DisableTransportSecurityRequirement();
            });

            Configure<OpenIddictServerAspNetCoreOptions>(options =>
            {
                options.DisableTransportSecurityRequirement = true;
            });
        }

        Configure<OpenIddictServerOptions>(options =>
        {
            var lifetime = configuration.GetSection("OpenIddict:Lifetime");
            options.AuthorizationCodeLifetime = lifetime.GetValue("AuthorizationCode", options.AuthorizationCodeLifetime);
            options.AccessTokenLifetime = lifetime.GetValue("AccessToken", options.AccessTokenLifetime);
            options.DeviceCodeLifetime = lifetime.GetValue("DeviceCode", options.DeviceCodeLifetime);
            options.IdentityTokenLifetime = lifetime.GetValue("IdentityToken", options.IdentityTokenLifetime);
            options.RefreshTokenLifetime = lifetime.GetValue("RefreshToken", options.RefreshTokenLifetime);
            options.RefreshTokenReuseLeeway = lifetime.GetValue("RefreshTokenReuseLeeway", options.RefreshTokenReuseLeeway);
            options.UserCodeLifetime = lifetime.GetValue("UserCode", options.UserCodeLifetime);
        });
        Configure<AbpOpenIddictAspNetCoreSessionOptions>(options =>
        {
            options.PersistentSessionGrantTypes.Add(SmsTokenExtensionGrantConsts.GrantType);
            options.PersistentSessionGrantTypes.Add(PortalTokenExtensionGrantConsts.GrantType);
            options.PersistentSessionGrantTypes.Add(LinkUserTokenExtensionGrantConsts.GrantType);
            options.PersistentSessionGrantTypes.Add(WeChatTokenExtensionGrantConsts.OfficialGrantType);
            options.PersistentSessionGrantTypes.Add(WeChatTokenExtensionGrantConsts.MiniProgramGrantType);
            options.PersistentSessionGrantTypes.Add(AbpWeChatWorkGlobalConsts.GrantType);
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

        //services.AddApiVersioning(config =>
        //{
        //    // Specify the default API Version as 1.0
        //    config.DefaultApiVersion = new ApiVersion(1, 0);
        //    // Advertise the API versions supported for the particular endpoint (through 'api-supported-versions' response header which lists all available API versions for that endpoint)
        //    config.ReportApiVersions = true;
        //});

        //services.AddVersionedApiExplorer(options =>
        //{
        //    // add the versioned api explorer, which also adds IApiVersionDescriptionProvider service
        //    // note: the specified format code will format the version as "'v'major[.minor][-status]"
        //    options.GroupNameFormat = "'v'VVV";

        //    // note: this option is only necessary when versioning by url segment. the SubstitutionFormat
        //    // can also be used to control the format of the API version in route templates
        //    options.SubstituteApiVersionInUrl = true;
        //});
    }

    private void ConfigureKestrelServer()
    {
        Configure<KestrelServerOptions>(options =>
        {
            options.Limits.MaxRequestBodySize = null;
            options.Limits.MaxRequestBufferSize = null;
        });
    }

    private void ConfigureBlobStoring(IConfiguration configuration)
    {
        Configure<AbpBlobStoringOptions>(options =>
        {
            options.Containers.ConfigureAll((containerName, containerConfiguration) =>
            {
                containerConfiguration.UseFileSystem(fileSystem =>
                {
                    fileSystem.BasePath = Path.Combine(Directory.GetCurrentDirectory(), "blobs");
                });

                //containerConfiguration.UseMinio(minio =>
                //{
                //    configuration.GetSection("Minio").Bind(minio);
                //});
            });
        });
    }

    private void ConfigureTextTemplating(IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("TextTemplating:IsDynamicStoreEnabled"))
        {
            Configure<AbpTextTemplatingCachingOptions>(options =>
            {
                options.IsDynamicTemplateDefinitionStoreEnabled = true;
            });
        }
    }

    private void ConfigureFeatureManagement(IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("FeatureManagement:IsDynamicStoreEnabled"))
        {
            Configure<FeatureManagementOptions>(options =>
            {
                options.IsDynamicFeatureStoreEnabled = true;
            });
        }
        Configure<FeatureManagementOptions>(options =>
        {
            options.ProviderPolicies[EditionFeatureValueProvider.ProviderName] = AbpSaasPermissions.Editions.ManageFeatures;
            options.ProviderPolicies[TenantFeatureValueProvider.ProviderName] = AbpSaasPermissions.Tenants.ManageFeatures;
        });
    }

    private void ConfigureSettingManagement(IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("SettingManagement:IsDynamicStoreEnabled"))
        {
            Configure<SettingManagementOptions>(options =>
            {
                options.IsDynamicSettingStoreEnabled = true;
            });
        }
    }

    private void ConfigureWebhooksManagement(IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("WebhooksManagement:IsDynamicStoreEnabled"))
        {
            Configure<WebhooksManagementOptions>(options =>
            {
                options.IsDynamicWebhookStoreEnabled = true;
            });
        }
    }
    /// <summary>
    /// Cấu hình xuất dữ liệu
    /// </summary>
    private void ConfigureExporter()
    {
        Configure<AbpExporterMiniExcelOptions>(options =>
        {
            // options.MapExportSetting(typeof(BookDto), config =>
            // {
            //     config.DynamicColumns = new[]
            //     {
            //         // Bỏ qua một số trường
            //         new DynamicExcelColumn(nameof(BookDto.AuthorId)){ Ignore = true },
            //         new DynamicExcelColumn(nameof(BookDto.LastModificationTime)){ Ignore = true },
            //         new DynamicExcelColumn(nameof(BookDto.LastModifierId)){ Ignore = true },
            //         new DynamicExcelColumn(nameof(BookDto.CreationTime)){ Ignore = true },
            //         new DynamicExcelColumn(nameof(BookDto.CreatorId)){ Ignore = true },
            //         new DynamicExcelColumn(nameof(BookDto.Id)){ Ignore = true },
            //     };
            // });
        });
    }
    /// <summary>
    /// Cấu hình quyền dữ liệu
    /// </summary>
    private void ConfigureEntityDataProtected()
    {
        // Configure<DataProtectionManagementOptions>(options =>
        // {
        //     options.AddEntities(typeof(DemoResource),
        //         new[]
        //         {
        //             typeof(Book),
        //         });
        // });
    }

    private void ConfigurePermissionManagement(IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("PermissionManagement:IsDynamicStoreEnabled"))
        {
            Configure<PermissionManagementOptions>(options =>
            {
                options.IsDynamicPermissionStoreEnabled = true;
            });
        }
        Configure<PermissionManagementOptions>(options =>
        {
            // Rename IdentityServer.Client.ManagePermissions
            // See https://github.com/abpframework/abp/blob/dev/modules/identityserver/src/Volo.Abp.PermissionManagement.Domain.IdentityServer/Volo/Abp/PermissionManagement/IdentityServer/AbpPermissionManagementDomainIdentityServerModule.cs
            options.ProviderPolicies[ClientPermissionValueProvider.ProviderName] = AbpOpenIddictPermissions.Applications.ManagePermissions;

            //if (configuration.GetValue<bool>("AuthServer:UseOpenIddict"))
            //{
            //    options.ProviderPolicies[ClientPermissionValueProvider.ProviderName] = AbpOpenIddictPermissions.Applications.ManagePermissions;
            //}
            //else
            //{
            //    options.ProviderPolicies[ClientPermissionValueProvider.ProviderName] = AbpIdentityServerPermissions.Clients.ManagePermissions;
            //}
        });
    }

    private void ConfigureNotificationManagement(IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("NotificationsManagement:IsDynamicStoreEnabled"))
        {
            Configure<AbpNotificationsManagementOptions>(options =>
            {
                options.IsDynamicNotificationsStoreEnabled = true;
            });
        }
    }

    private void ConfigureDistributedLock(IServiceCollection services, IConfiguration configuration)
    {
        var distributedLockEnabled = configuration["DistributedLock:IsEnabled"];
        if (distributedLockEnabled.IsNullOrEmpty() || bool.Parse(distributedLockEnabled))
        {
            var redis = ConnectionMultiplexer.Connect(configuration["DistributedLock:Redis:Configuration"]);
            services.AddSingleton<IDistributedLockProvider>(_ => new RedisDistributedSynchronizationProvider(redis.GetDatabase()));
        }
    }

    private void ConfigureVirtualFileSystem()
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<MicroServiceApplicationsSingleModule>("PackageName.CompanyName.ProjectName.AIO");
        });
    }

    private void ConfigureIdempotent()
    {
        Configure<AbpIdempotentOptions>(options =>
        {
            options.IsEnabled = true;
            options.DefaultTimeout = 0;
        });
    }

    private void ConfigureDbContext()
    {
        // Cấu hình Ef
        Configure<AbpDbContextOptions>(options =>
        {
#if MySQL
            options.UseMySQL();
            options.UseMySQL<ProjectNameDbContext>();
#elif SqlServer
            options.UseSqlServer();
            options.UseSqlServer<ProjectNameDbContext>(builder =>
            {
                // see https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-compatibility-level?view=sql-server-ver16
                // builder.UseCompatibilityLevel(150);
            });
#elif Sqlite
            options.UseSqlite();
            options.UseSqlite<ProjectNameDbContext>();
#elif Oracle || OracleDevart
            options.UseOracle();
            options.UseOracle<ProjectNameDbContext>();
#elif PostgreSql
            System.AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);// Giải quyết vấn đề PostgreSql sau khi đặt thành thời gian UTC thì không ghi được múi giờ local
            options.UseNpgsql();
            options.UseNpgsql<ProjectNameDbContext>();
#endif
        });
    }

    private void ConfigureDataSeeder()
    {
        Configure<CustomIdentityResourceDataSeederOptions>(options =>
        {
            options.Resources.Add(new CustomIdentityResources.AvatarUrl());
        });
    }

    private void ConfigureExceptionHandling()
    {
        // Các ngoại lệ tùy chỉnh cần xử lý
        Configure<AbpExceptionHandlingOptions>(options =>
        {
            //  Thêm loại ngoại lệ cần xử lý
            options.Handlers.Add<Volo.Abp.Data.AbpDbConcurrencyException>();
            options.Handlers.Add<AbpInitializationException>();
            options.Handlers.Add<OutOfMemoryException>();
            options.Handlers.Add<System.Data.Common.DbException>();
            options.Handlers.Add<global::Microsoft.EntityFrameworkCore.DbUpdateException>();
            options.Handlers.Add<System.Data.DBConcurrencyException>();
        });
        // Loại ngoại lệ tùy chỉnh cần gửi thông báo qua email
        Configure<AbpEmailExceptionHandlingOptions>(options =>
        {
            // Có gửi thông tin ngăn xếp hay không
            options.SendStackTrace = true;
            // Email nhận mặc định khi chưa chỉ định người nhận ngoại lệ
            // Chỉ định địa chỉ email của chính bạn
        });

        Configure<VoloAbpExceptionHandlingOptions>(options =>
        {
            options.SendStackTraceToClients = false;
            options.SendExceptionsDetailsToClients = false;
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

    private void ConfigureMultiTenancy(IConfiguration configuration)
    {
        // Đa thuê bao
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

    private void ConfigureSwagger(IServiceCollection services)
    {
        // Swagger
        services.AddSwaggerGen(
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "App API", Version = "v1" });
                options.DocInclusionPredicate((docName, description) => true);
                options.CustomSchemaIds(type => type.FullName);
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Scheme = "bearer",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                            },
                            new string[] { }
                        }
                });
                options.OperationFilter<TenantHeaderParamter>();
            });
    }

    private void ConfigureIdentity(IConfiguration configuration)
    {
        // Thêm định nghĩa tệp cấu hình, cần khi tạo thuê bao mới
        Configure<IdentityOptions>(options =>
        {
            var identityConfiguration = configuration.GetSection("Identity");
            if (identityConfiguration.Exists())
            {
                identityConfiguration.Bind(options);
            }
        });
        Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
        Configure<IdentitySessionCleanupOptions>(options =>
        {
            options.IsCleanupEnabled = true;
        });
    }

    private void ConfigureMvcUiTheme()
    {
        Configure<AbpBundlingOptions>(options =>
        {
            //options.StyleBundles.Configure(
            //    LeptonXLiteThemeBundles.Styles.Global,
            //    bundle =>
            //    {
            //        bundle.AddFiles("/global-styles.css");
            //    }
            //);
        });
        
        Configure<AbpMvcLibsOptions>(options =>
        {
            options.CheckLibs = false;
        });
    }
    
    private void ConfigureHangfire(IServiceCollection services, IConfiguration configuration)
    {
        // Cấu hình bộ nhớ và cài đặt Hangfire
        Configure<AbpBackgroundWorkerOptions>(options =>
        {
            options.IsEnabled = true;
        });

        var redis = ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]);
        // Cấu hình Hangfire
        services.AddHangfire(config =>
        {
            config.UseRedisStorage(redis);
        });

    }

    private void ConfigureLocalization()
    {
        Configure<AbpLocalizationOptions>(options =>
        {
            options.Languages.Add(new LanguageInfo("en", "en", "English"));
            options.Languages.Add(new LanguageInfo("zh-Hans", "zh-Hans", "Tiếng Trung giản thể"));

            options
                .AddLanguagesMapOrUpdate(
                    "vue-admin-element-ui",
                    new NameValue("zh-Hans", "zh"),
                    new NameValue("en", "en"));

            // Ánh xạ ngôn ngữ vben admin
            options
                .AddLanguagesMapOrUpdate(
                    "vben-admin-ui",
                    new NameValue("zh_CN", "zh-Hans"));

            options.Resources.Get<AbpSettingManagementResource>()
                .AddBaseTypes(
                typeof(IdentityResource),
                typeof(AliyunResource),
                typeof(TencentCloudResource),
                typeof(WeChatResource),
                typeof(PlatformResource),
                typeof(AbpOpenIddictResource),
                typeof(AbpIdentityServerResource));

            options.UseAllPersistence();
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
    }

    private void ConfigureWrapper()
    {
        Configure<AbpWrapperOptions>(options =>
        {
            options.IsEnabled = true;
            // options.IsWrapUnauthorizedEnabled = true;
            options.IgnoreNamespaces.Add("Elsa");
        });
    }

    private void PreConfigureWrapper()
    {
        //PreConfigure<AbpDaprClientProxyOptions>(options =>
        //{
        //    options.ProxyRequestActions.Add(
        //        (appid, httprequestmessage) =>
        //        {
        //            httprequestmessage.Headers.TryAddWithoutValidation(AbpHttpWrapConsts.AbpDontWrapResult, "true");
        //        });
        //});

        PreConfigure<AbpHttpClientBuilderOptions>(options =>
        {
            options.ProxyClientActions.Add(
                (_, _, client) =>
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation(AbpHttpWrapConsts.AbpDontWrapResult, "true");
                });
        });
    }

    private void ConfigureAuditing()
    {
        Configure<AbpAuditingOptions>(options =>
        {
            // options.IsEnabledForGetRequests = true;
            options.ApplicationName = ApplicationName;
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

    private void ConfigureSecurity(IServiceCollection services, IConfiguration configuration, bool isDevelopment = false)
    {
        Configure<AbpAntiForgeryOptions>(options =>
        {
            // SEC-10 (vòng 15): khôi phục default ABP (AutoValidate = true) cho nhất
            // quán với host AllInOne (sửa vòng 14). Trước đây AutoValidate = false tắt
            // hoàn toàn antiforgery auto-validation: request mang cookie Identity mà
            // không có token vẫn qua được API controller. Bearer request không cookie
            // vẫn được filter bỏ qua (ngữ nghĩa base filter của ABP 10.7.0), nên sửa
            // này không chặn đường bearer của SPA.
            options.AutoValidate = true;
        });

        services.Replace<CookieAuthenticationHandler, AbpCookieAuthenticationHandler>(ServiceLifetime.Scoped);

        services.AddAuthentication()
                .AddAbpJwtBearer(options =>
                {
                    configuration.GetSection("AuthServer").Bind(options);

                    options.Events ??= new JwtBearerEvents();
                    options.Events.OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            (path.StartsWithSegments("/api/files")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    };
                });

        if (!isDevelopment)
        {
            var redis = ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]);
            services
                .AddDataProtection()
                .SetApplicationName("LINGYUN.Abp.Application")
                .PersistKeysToStackExchangeRedis(redis, "LINGYUN.Abp.Application:DataProtection:Protection-Keys");
        }

        services.AddSameSiteCookiePolicy();
    }

    private void ConfigureCors(IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(DefaultCorsPolicyName, builder =>
            {
                builder
                    .WithOrigins(
                        configuration["App:CorsOrigins"]
                            .Split(",", StringSplitOptions.RemoveEmptyEntries)
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

    private void ConfigureWeChat()
    {
        Configure<AbpWeChatMessageHandleOptions>(options =>
        {
            // Trả lời tin nhắn văn bản
            options.MapMessage<
                LINGYUN.Abp.WeChat.Official.Messages.Models.TextMessage,
                TextMessageReplyContributor>();
            // Xử lý sự kiện theo dõi
            options.MapEvent<
                LINGYUN.Abp.WeChat.Official.Messages.Models.UserSubscribeEvent,
                UserSubscribeEventContributor>();

            options.MapMessage<
                LINGYUN.Abp.WeChat.Work.Common.Messages.Models.TextMessage,
                WeChat.Work.Messages.TextMessageReplyContributor>();
        });
    }
}
