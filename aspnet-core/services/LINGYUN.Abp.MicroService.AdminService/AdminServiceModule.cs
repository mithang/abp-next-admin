using LINGYUN.Abp.Aliyun.SettingManagement;
using LINGYUN.Abp.AspNetCore.HttpOverrides;
using LINGYUN.Abp.AspNetCore.Mvc.Wrapper;
using LINGYUN.Abp.AspNetCore.Session;
using LINGYUN.Abp.AuditLogging.IP.Location;
using LINGYUN.Abp.Auditing;
using LINGYUN.Abp.AuditLogging.Elasticsearch;
using LINGYUN.Abp.BlobManagement.SettingManagement;
using LINGYUN.Abp.CachingManagement;
using LINGYUN.Abp.CachingManagement.StackExchangeRedis;
using LINGYUN.Abp.AspNetCore.Authentication;
using LINGYUN.Abp.Data.DbMigrator;
using LINGYUN.Abp.DataProtectionManagement;
using LINGYUN.Abp.Dynamic.Definitions;
using LINGYUN.Abp.Emailing.Platform;
using LINGYUN.Abp.EventBus.CAP;
using LINGYUN.Abp.ExceptionHandling.Emailing;
using LINGYUN.Abp.FeatureManagement;
using LINGYUN.Abp.FeatureManagement.HttpApi;
using LINGYUN.Abp.IP2Region;
using LINGYUN.Abp.Identity.EntityFrameworkCore;
using LINGYUN.Abp.Localization.CultureMap;
using LINGYUN.Abp.LocalizationManagement.EntityFrameworkCore;
using LINGYUN.Abp.Logging.Serilog.Elasticsearch;
using LINGYUN.Abp.Logging.Serilog.OpenObserve;
using LINGYUN.Abp.MicroService.AdminService.EntityFrameworkCore;
using LINGYUN.Abp.PermissionManagement;
using LINGYUN.Abp.PermissionManagement.HttpApi;
using LINGYUN.Abp.PermissionManagement.OrganizationUnits;
using LINGYUN.Abp.Saas;
using LINGYUN.Abp.Saas.EntityFrameworkCore;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using LINGYUN.Abp.SettingManagement;
using LINGYUN.Abp.Sms.Platform;
using LINGYUN.Abp.Telemetry.OpenTelemetry;
using LINGYUN.Abp.Telemetry.SkyWalking;
using LINGYUN.Abp.Tencent.SettingManagement;
using LINGYUN.Abp.TextTemplating;
using LINGYUN.Abp.TextTemplating.EntityFrameworkCore;
using LINGYUN.Abp.TextTemplating.Scriban;
using LINGYUN.Abp.WxPusher.SettingManagement;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Volo.Abp;
using Volo.Abp.AspNetCore.Authentication.JwtBearer;
using Volo.Abp.AspNetCore.Mvc.UI.MultiTenancy;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.Caching.StackExchangeRedis;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Http.Client;
using Volo.Abp.Modularity;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.Identity;
using Volo.Abp.PermissionManagement.OpenIddict;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.Swashbuckle;

namespace LINGYUN.Abp.MicroService.AdminService;

[DependsOn(
    typeof(AbpCAPEventBusModule),
    typeof(AbpSerilogEnrichersApplicationModule),
    typeof(AbpSerilogEnrichersUniqueIdModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpLoggingSerilogElasticsearchModule),
    typeof(AbpLoggingSerilogOpenObserveModule),
    typeof(AbpAuditLoggingElasticsearchModule),
    typeof(AbpAuditLoggingIPLocationModule),
    typeof(AbpIP2RegionModule),
    typeof(AbpAspNetCoreMvcUiMultiTenancyModule),

    // Thiết lập quản trị
    typeof(AbpAliyunSettingManagementModule),
    typeof(AbpTencentCloudSettingManagementModule),
    // typeof(AbpWeChatSettingManagementModule),
    typeof(AbpWxPusherSettingManagementModule),
    typeof(AbpBlobManagementSettingManagementModule),

    typeof(AbpSettingManagementApplicationModule),
    typeof(AbpSettingManagementHttpApiModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpPermissionManagementHttpApiModule),
    typeof(AbpDataProtectionManagementApplicationModule),
    typeof(AbpDataProtectionManagementHttpApiModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpFeatureManagementHttpApiModule),
    typeof(AbpFeatureManagementClientModule),
    typeof(AbpAuditingApplicationModule),
    typeof(AbpAuditingHttpApiModule),
    typeof(AbpSaasApplicationModule),
    typeof(AbpSaasHttpApiModule),
    typeof(AbpSaasDbCheckerModule),
    typeof(AbpTextTemplatingApplicationModule),
    typeof(AbpTextTemplatingHttpApiModule),
    typeof(AbpCachingManagementApplicationModule),
    typeof(AbpCachingManagementHttpApiModule),
    typeof(AbpCachingManagementStackExchangeRedisModule),
    typeof(AbpIdentityEntityFrameworkCoreModule),// Cần tham chiếu package cho quyền vai trò người dùng
    typeof(AbpOpenIddictEntityFrameworkCoreModule), // Cần tham chiếu package cho quyền client
    typeof(AbpPermissionManagementDomainOrganizationUnitsModule), // Quản lý quyền tổ chức
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementDomainIdentityModule),
    typeof(AbpPermissionManagementDomainOpenIddictModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpLocalizationManagementEntityFrameworkCoreModule),
    typeof(AbpTextTemplatingEntityFrameworkCoreModule),
    // Ghi đè template engine để hỗ trợ bản địa hóa bên ngoài
    typeof(AbpTextTemplatingScribanModule),
    typeof(AdminServiceMigrationsEntityFrameworkCoreModule),
    typeof(AbpDataDbMigratorModule),
    typeof(AbpAspNetCoreAuthenticationJwtBearerModule),
    typeof(AbpEmailingExceptionHandlingModule),
    typeof(AbpTelemetryOpenTelemetryModule),
    typeof(AbpTelemetrySkyWalkingModule),
    typeof(AbpHttpClientModule),
    typeof(AbpSmsPlatformModule),
    typeof(AbpEmailingPlatformModule),
    typeof(AbpCachingStackExchangeRedisModule),
    typeof(AbpLocalizationCultureMapModule),
    typeof(AbpAspNetCoreSessionModule),
    typeof(AbpAspNetCoreMvcWrapperModule),
    typeof(AbpAspNetCoreHttpOverridesModule),
    typeof(AbpDynamicDefinitionsModule),
    typeof(AbpAspNetCoreAuthenticationModule),
    typeof(AbpSwashbuckleModule),
    typeof(AbpAutofacModule)
    )]
public partial class AdminServiceModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();

        PreConfigureWrapper();
        PreConfigureFeature();
        PreConfigureApp(configuration);
        PreConfigureCAP(configuration);
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        ConfigureWrapper();
        ConfigureLocalization();
        ConfigureBackgroundWorker();
        ConfigureExceptionHandling();
        ConfigureVirtualFileSystem();
        ConfigureTextTemplating();
        ConfigureSettingManagement();
        ConfigureFeatureManagement();
        ConfigurePermissionManagement();
        ConfigureDataProtectedManagement();
        ConfigureIdentity(configuration);
        ConfigureTiming(configuration);
        ConfigureCaching(configuration);
        ConfigureAuditing(configuration);
        ConfigureMultiTenancy(configuration);
        ConfigureJsonSerializer(configuration);
        ConfigureMvc(context.Services, configuration);
        ConfigureCors(context.Services, configuration);
        if (hostingEnvironment.IsDevelopment())
        {
            ConfigureSwagger(context.Services, configuration);
        }
        ConfigureDistributedLocking(context.Services, configuration);
        ConfigureSecurity(context.Services, configuration, hostingEnvironment.IsDevelopment());
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();
        app.UseForwardedHeaders();
        // Bản địa hóa
        app.UseMapRequestLocalization();
        // Chuỗi gọi HTTP
        app.UseCorrelationId();
        // Hệ thống file
        app.MapAbpStaticAssets();
        // Định tuyến
        app.UseRouting();
        // CORS
        app.UseCors();
        // Xác thực
        app.UseAuthentication();
        app.UseJwtTokenMiddleware();
        // Đa tenant
        app.UseMultiTenancy();
        // jwt
        app.UseDynamicClaims();
        // Phân quyền
        app.UseAuthorization();
        if (env.IsDevelopment())
        {
            // Swagger
            app.UseSwagger();
            // Giao diện trực quan Swagger
            app.UseAbpSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Support Admin Service API");

                var configuration = context.GetConfiguration();
                options.OAuthClientId(configuration["AuthServer:SwaggerClientId"]);
                options.OAuthScopes(configuration["AuthServer:Audience"]);
            });
        }
        // Nhật ký kiểm toán
        app.UseAuditing();
        app.UseAbpSerilogEnrichers();
        // Định tuyến
        app.UseConfiguredEndpoints();
    }
}
