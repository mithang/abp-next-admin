using DotNetCore.CAP;
using LINGYUN.Abp.AspNetCore.MultiTenancy;
using LINGYUN.Abp.Identity;
using LINGYUN.Abp.Localization.CultureMap;
using LINGYUN.Abp.LocalizationManagement;
using LINGYUN.Abp.MicroService.AuthServer.Ui.Branding;
using LINGYUN.Abp.OpenIddict.Impersonation;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using LINGYUN.Abp.Wrapper;
using Medallion.Threading;
using Medallion.Threading.Redis;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Server;
using OpenIddict.Server.AspNetCore;
using OpenIddict.Validation.AspNetCore;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using Volo.Abp.Account.Localization;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite.Bundling;
using Volo.Abp.Auditing;
using Volo.Abp.BlobStoring;
using Volo.Abp.Caching;
using Volo.Abp.FeatureManagement;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Http.Client;
using Volo.Abp.Json;
using Volo.Abp.Json.SystemTextJson;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.OpenIddict;
using Volo.Abp.OpenIddict.WildcardDomains;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Security.Claims;
using Volo.Abp.SettingManagement;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.MicroService.AuthServer;

public partial class AuthServerModule
{
    public static string ApplicationName { get; set; } = "AuthServer";
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

    private void PreConfigureAuthServer(IConfiguration configuration)
    {
        PreConfigure<OpenIddictBuilder>(builder =>
        {
            builder.AddValidation(options =>
            {
                var validAudiences = configuration.GetSection("AuthServer:ValidAudiences").Get<string[]>();
                if (validAudiences?.Length > 0)
                {
                    options.AddAudiences(validAudiences);
                }

                options.UseLocalServer();

                options.UseAspNetCore();

                options.UseDataProtection();
            });
        });
    }

    private void PreConfigureCertificate(IConfiguration configuration, IWebHostEnvironment environment)
    {
        if (!environment.IsDevelopment())
        {
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(builder =>
            {
                // SEC-17: App:SslPassword KHÔNG được ghi vào appsettings.json (SEC-02:
                // appsettings chỉ giữ placeholder rỗng). Khi deploy phải cấp qua biến môi
                // trường App__SslPassword hoặc user-secrets; thiếu password thì quá trình
                // khởi động fail-closed khi nạp file .pfx có mật khẩu — không được "sửa"
                // bằng cách ghi lại password vào appsettings.
                builder.AddProductionEncryptionAndSigningCertificate(configuration["App:SslFile"], configuration["App:SslPassword"]);
            });
        }

        // SEC-03: chỉ tắt yêu cầu transport security khi Development.
        if (environment.IsDevelopment())
        {
            PreConfigure<OpenIddictServerBuilder>(builder =>
            {
                // builder.UseDataProtection();

                // Tắt https (chỉ Development)
                builder.UseAspNetCore()
                    .DisableTransportSecurityRequirement();
            });
        }

        var wildcardDomains = configuration.GetSection("App:WildcardDomains").Get<List<string>>();
        if (wildcardDomains?.Count > 0)
        {
            PreConfigure<AbpOpenIddictWildcardDomainOptions>(options =>
            {
                options.EnableWildcardDomainSupport = true;
                options.WildcardDomainsFormat.AddIfNotContains(wildcardDomains);
            });
        }
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

        Configure<AbpBundlingOptions>(options =>
        {
            options.StyleBundles
                .Configure(LeptonXLiteThemeBundles.Styles.Global, bundle =>
                {
                    bundle.AddFiles("/css/global-styles.css");
                });
        });

        // DEVOPS iter-0006 (DEV-11): /healthz truoc day tro trui (AddHealthChecks()
        // khong check nao) nen luon 200 ke ca khi DB/Redis chet. Dang ky check
        // dependency that tai day; xem HealthChecks/AuthServerHealthChecks.cs. Quet DbContext tu
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

    private void ConfigureDataSeeder()
    {

    }

    private void ConfigureFeatureManagement()
    {
        Configure<FeatureManagementOptions>(options =>
        {
            options.SaveStaticFeaturesToDatabase = false;
            options.IsDynamicFeatureStoreEnabled = true;
        });
    }

    private void ConfigurePermissionManagement()
    {
        Configure<PermissionManagementOptions>(options =>
        {
            options.SaveStaticPermissionsToDatabase = false;
            options.IsDynamicPermissionStoreEnabled = true;
        });
    }

    private void ConfigureSettingManagement()
    {
        Configure<SettingManagementOptions>(options =>
        {
            options.SaveStaticSettingsToDatabase = false;
            options.IsDynamicSettingStoreEnabled = true;
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

    private void ConfigureDistributedLocking(IServiceCollection services, IConfiguration configuration)
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

    private void ConfigureBranding(IConfiguration configuration)
    {
        Configure<AccountBrandingOptions>(options =>
        {
            configuration.GetSection("App:Branding").Bind(options);
        });
    }

    private void ConfigureBlobStoring(IConfiguration configuration)
    {
        Configure<AbpBlobStoringOptions>(options =>
        {
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
    private void ConfigureIdentity(IConfiguration configuration)
    {
        // Thêm định nghĩa tệp cấu hình, cần khi tạo tenant mới
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
            options.IsRemoteRefreshEnabled = false;
        });
    }
    private void ConfigureVirtualFileSystem()
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<AuthServerModule>("LINGYUN.Abp.MicroService.AuthServer");
        });
    }
    private void ConfigureLocalization()
    {
        Configure<AbpLocalizationOptions>(options =>
        {
            options.Languages.Add(new LanguageInfo("en", "en", "English"));
            options.Languages.Add(new LanguageInfo("zh-Hans", "zh-Hans", "Tiếng Trung giản thể"));

            options.Resources
                .Get<AccountResource>()
                .AddVirtualJson("/Localization/Resources");
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
    private void ConfigureTiming(IConfiguration configuration)
    {
        Configure<AbpClockOptions>(options =>
        {
            configuration.GetSection("Clock").Bind(options);
        });
    }

    private void ConfigureAuditing(IConfiguration configuration)
    {
        Configure<AbpAuditingOptions>(options =>
        {
            // options.IsEnabledForGetRequests = true;
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

    private void ConfigureAuthServer(IConfiguration configuration, IWebHostEnvironment environment)
    {
        // SEC-03: chỉ tắt yêu cầu transport security khi Development.
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

        Configure<OpenIddictImpersonationOptions>(options =>
        {
            options.ImpersonationPermission = IdentityPermissions.Users.Impersonation;
            options.ImpersonationTenantPermission = "AbpSaas.Tenants.Impersonation";
        });
    }
    private void ConfigureSecurity(IServiceCollection services, IConfiguration configuration, bool isDevelopment = false)
    {
        services.ForwardIdentityAuthenticationForBearer(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);

        services
            .AddAuthentication()
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromDays(365);
            })
            .AddJwtBearer(options =>
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
        //.AddWeChatWork(options =>
        //{
        //    options.SignInScheme = IdentityConstants.ExternalScheme;
        //});

        services.AddDataProtection()
            .SetApplicationName("LINGYUN.Abp.Application")
            .PersistKeysToStackExchangeRedis(() =>
            {
                return ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]).GetDatabase();
            },
            "LINGYUN.Abp.Application:DataProtection:Protection-Keys");

        services.AddSameSiteCookiePolicy();
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
                    options.AddOnlyDomainTenantResolver(domain);
                }
            });
        }
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

    private void PreConfigureWrapper()
    {
        PreConfigure<AbpHttpClientBuilderOptions>(options =>
        {
            // Gọi http giữa các service gửi header yêu cầu không cần đóng gói kết quả
            options.ProxyClientActions.Add(
                (_, _, client) =>
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation(AbpHttpWrapConsts.AbpDontWrapResult, "true");
                });
        });
    }
}
