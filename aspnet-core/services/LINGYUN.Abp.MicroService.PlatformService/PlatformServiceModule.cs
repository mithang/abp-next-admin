using LINGYUN.Abp.AspNetCore.Authentication;
using LINGYUN.Abp.AspNetCore.HttpOverrides;
using LINGYUN.Abp.AspNetCore.Mvc.Wrapper;
using LINGYUN.Abp.AspNetCore.Session;
using LINGYUN.Abp.AuditLogging.Elasticsearch;
using LINGYUN.Abp.AuditLogging.IP.Location;
using LINGYUN.Abp.Authorization.OrganizationUnits;
using LINGYUN.Abp.BlobManagement;
using LINGYUN.Abp.BlobManagement.Aliyun;
using LINGYUN.Abp.BlobManagement.FileSystem;
using LINGYUN.Abp.BlobManagement.MimeCheck;
using LINGYUN.Abp.BlobManagement.Minio;
using LINGYUN.Abp.BlobManagement.SettingManagement;
using LINGYUN.Abp.BlobManagement.Tencent;
using LINGYUN.Abp.BlobStoring.BlobManagement;
using LINGYUN.Abp.Data.DbMigrator;
using LINGYUN.Abp.Dynamic.Definitions;
using LINGYUN.Abp.EventBus.CAP;
using LINGYUN.Abp.ExceptionHandling.Emailing;
using LINGYUN.Abp.Features.LimitValidation.Redis;
using LINGYUN.Abp.IP2Region;
using LINGYUN.Abp.Localization.CultureMap;
using LINGYUN.Abp.LocalizationManagement.EntityFrameworkCore;
using LINGYUN.Abp.MicroService.PlatformService.BackgroundWorkers;
using LINGYUN.Abp.MicroService.PlatformService.EntityFrameworkCore;
using LINGYUN.Abp.Notifications;
using LINGYUN.Abp.Saas.EntityFrameworkCore;
using LINGYUN.Abp.Serilog.Enrichers.Application;
using LINGYUN.Abp.Serilog.Enrichers.UniqueId;
using LINGYUN.Abp.Sms.Aliyun;
using LINGYUN.Abp.Telemetry.OpenTelemetry;
using LINGYUN.Abp.Telemetry.SkyWalking;
using LINGYUN.Abp.UI.Navigation.VueVbenAdmin5;
using LINGYUN.Platform;
using LINGYUN.Platform.EntityFrameworkCore;
using LINGYUN.Platform.HttpApi;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Authentication.JwtBearer;
using Volo.Abp.AspNetCore.MultiTenancy;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.BlobStoring;
using Volo.Abp.Caching.StackExchangeRedis;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Http.Client;
using Volo.Abp.Http.Client.IdentityModel.Web;
using Volo.Abp.Identity;
using Volo.Abp.Imaging;
using Volo.Abp.MailKit;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.Identity;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.Swashbuckle;

namespace LINGYUN.Abp.MicroService.PlatformService;

[DependsOn(
    typeof(AbpSerilogEnrichersApplicationModule),
    typeof(AbpSerilogEnrichersUniqueIdModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpAuditLoggingElasticsearchModule),
    typeof(AbpAuditLoggingIPLocationModule),
    typeof(AbpIP2RegionModule),
    typeof(AbpAspNetCoreMultiTenancyModule),
    typeof(AbpUINavigationVueVbenAdmin5Module),
    typeof(AbpBlobManagementAliyunModule),    // Mô-đun nhà cung cấp lưu trữ Alibaba Cloud
    typeof(AbpBlobManagementTencentModule),   // Mô-đun nhà cung cấp lưu trữ Tencent Cloud
    typeof(AbpBlobManagementMinioModule),     // Mô-đun nhà cung cấp lưu trữ Minio
    typeof(AbpBlobManagementFileSystemModule),// Mô-đun nhà cung cấp hệ thống tệp cục bộ
    typeof(AbpBlobManagementMimeCheckModule),
    typeof(AbpBlobManagementApplicationModule),
    typeof(AbpBlobManagementHttpApiModule),
    typeof(AbpBlobManagementSettingManagementModule),
    typeof(AbpBlobStoringBlobManagementModule),
    typeof(AbpImagingImageSharpModule),
    typeof(PlatformApplicationModule),
    typeof(PlatformHttpApiModule),
    typeof(PlatformEntityFrameworkCoreModule),
    typeof(AbpIdentityHttpApiClientModule),
    typeof(AbpHttpClientIdentityModelWebModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpSaasEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementDomainIdentityModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpLocalizationManagementEntityFrameworkCoreModule),
    typeof(PlatformServiceMigrationsEntityFrameworkCoreModule),
    typeof(AbpDataDbMigratorModule),
    typeof(AbpAspNetCoreAuthenticationJwtBearerModule),
    typeof(AbpAuthorizationOrganizationUnitsModule),
    typeof(AbpNotificationsModule),
    typeof(AbpEmailingExceptionHandlingModule),
    typeof(AbpCAPEventBusModule),
    typeof(AbpFeaturesValidationRedisModule),
    // typeof(AbpFeaturesClientModule),// Bỏ chú thích mô-đun này khi cần giới hạn tính năng phía client
    // typeof(AbpFeaturesValidationRedisClientModule),// Bỏ chú thích mô-đun này khi cần giới hạn tính năng phía client
    typeof(AbpCachingStackExchangeRedisModule),
    typeof(AbpLocalizationCultureMapModule),
    typeof(AbpTelemetryOpenTelemetryModule),
    typeof(AbpTelemetrySkyWalkingModule),
    typeof(AbpHttpClientModule),
    typeof(AbpMailKitModule),
    typeof(AbpAliyunSmsModule),
    typeof(AbpAspNetCoreSessionModule),
    typeof(AbpAspNetCoreMvcWrapperModule),
    typeof(AbpAspNetCoreAuthenticationModule),
    typeof(AbpAspNetCoreHttpOverridesModule),
    typeof(AbpDynamicDefinitionsModule),
    typeof(AbpSwashbuckleModule),
    typeof(AbpAutofacModule)
    )]
public partial class PlatformServiceModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();

        PreConfigureWrapper();
        PreForwardedHeaders();
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
        ConfigureKestrelServer();
        ConfigureExceptionHandling();
        ConfigureVirtualFileSystem();
        ConfigureFeatureManagement();
        ConfigureTiming(configuration);
        ConfigureCaching(configuration);
        ConfigureIdentity(configuration);
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

        ConfigurePlatformModule(context.Services);
    }

    public async override Task OnPostApplicationInitializationAsync(ApplicationInitializationContext context)
    {
        var options = context.ServiceProvider.GetRequiredService<IOptions<AbpBlobManagementOptions>>().Value;
        if (options.IsCleanupEnabled)
        {
            await context.ServiceProvider
                .GetRequiredService<IBackgroundWorkerManager>()
                .AddAsync(context.ServiceProvider.GetRequiredService<BlobTempCleanupBackgroundWorker>());
        }

        await context.ServiceProvider
            .GetRequiredService<IBlobDataSeeder>()
            .SeedAsync();
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
        // Hệ thống tệp ảo
        app.MapAbpStaticAssets();
        // Định tuyến
        app.UseRouting();
        // Truy cập liên miền
        app.UseCors();
        // Xác thực
        app.UseAuthentication();
        app.UseJwtTokenMiddleware();
        // Đa tenant
        app.UseMultiTenancy();
        // Phiên làm việc
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
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Support Platform Service API");

                var configuration = context.GetConfiguration();
                options.OAuthClientId(configuration["AuthServer:SwaggerClientId"]);
                options.OAuthScopes(configuration["AuthServer:Audience"]);
            });
        }
        // Nhật ký kiểm toán
        app.UseAuditing();
        // Ghi thông tin yêu cầu
        app.UseAbpSerilogEnrichers();
        // Định tuyến
        app.UseConfiguredEndpoints();
    }
}
