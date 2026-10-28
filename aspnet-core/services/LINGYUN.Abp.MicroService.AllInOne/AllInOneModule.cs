namespace LINGYUN.Abp.MicroService.AllInOne;

[DependsOn(
    // Module bus sự kiện CAP
    typeof(AbpCAPEventBusModule),
    // Module mở rộng Serilog thông tin ứng dụng
    typeof(AbpSerilogEnrichersApplicationModule),
    // Module mở rộng Serilog Id duy nhất toàn cục
    typeof(AbpSerilogEnrichersUniqueIdModule),
    // Module Serilog
    typeof(AbpAspNetCoreSerilogModule),
    // Module xác thực danh tính mở rộng xác thực UserToken
    typeof(AbpIdentityAspNetCoreModule),
    // Module xác thực danh tính tích hợp thông báo
    typeof(AbpIdentityNotificationsModule),
    // Module xác thực danh tính tích hợp tổ chức
    typeof(AbpIdentityOrganizaztionUnitsModule),
    // Module xác thực danh tính định danh WeChat
    typeof(AbpIdentityWeChatModule),
    // Module xác thực danh tính định danh WeChat doanh nghiệp
    typeof(AbpIdentityWeChatWorkModule),
    // Module xác thực danh tính dịch vụ miền
    typeof(AbpIdentityDomainModule),
    // Module xác thực danh tính dịch vụ ứng dụng
    typeof(AbpIdentityApplicationModule),
    // Module xác thực danh tính bộ điều khiển
    typeof(AbpIdentityHttpApiModule),
    // Module xác thực danh tính Entity Framework
    typeof(AbpIdentityEntityFrameworkCoreModule),
    // Module xác thực danh tính giao diện Mvc
    typeof(AbpIdentityWebModule),

    // Module tài khoản dịch vụ ứng dụng
    typeof(AbpAccountApplicationModule),
    // Module tài khoản bộ điều khiển
    typeof(AbpAccountHttpApiModule),
    // Module tài khoản tích hợp OpenIddict
    typeof(AbpAccountWebOpenIddictModule),
    // Module tài khoản tích hợp OAuth
    typeof(AbpAccountWebOAuthModule),
    // Sử dụng LazyCaptcha thành phần mã xác minh
    typeof(AbpAccountWebLazyCaptchaModule),
    // Sử dụng thành phần mã xác minh Tencent Cloud, cần cấu hình sẵn các tham số liên quan của Tencent Cloud
    typeof(AbpAccountWebTencentCaptchaModule),
    // Sử dụng thành phần mã xác minh Alibaba Cloud, cần cấu hình sẵn các tham số liên quan của Alibaba Cloud
    typeof(AbpAccountWebAliyunCaptchaModule),

    // Gdpr Module nhà cung cấp xác thực danh tính
    typeof(AbpGdprDomainIdentityModule),
    // Gdpr Module dịch vụ ứng dụng
    typeof(AbpGdprApplicationModule),
    // Gdpr Module bộ điều khiển
    typeof(AbpGdprHttpApiModule),
    // Gdpr Module Entity Framework
    typeof(AbpGdprEntityFrameworkCoreModule),
    // Gdpr trang Mvc
    typeof(AbpGdprWebModule),

    // MVC Theme
    typeof(AbpAspNetCoreMvcUiLeptonXLiteThemeModule),

    // Module bộ nhớ đệm tích hợp Redis
    typeof(AbpCachingStackExchangeRedisModule),
    // Module quản lý bộ nhớ đệm tích hợp Redis
    typeof(AbpCachingManagementStackExchangeRedisModule),
    // Module quản lý bộ nhớ đệm dịch vụ ứng dụng
    typeof(AbpCachingManagementApplicationModule),
    // Module quản lý bộ nhớ đệm bộ điều khiển
    typeof(AbpCachingManagementHttpApiModule),

    // Module quản lý đa ngôn ngữ dịch vụ miền
    typeof(AbpLocalizationManagementDomainModule),
    // Module quản lý đa ngôn ngữ dịch vụ ứng dụng
    typeof(AbpLocalizationManagementApplicationModule),
    // Module quản lý đa ngôn ngữ bộ điều khiển
    typeof(AbpLocalizationManagementHttpApiModule),
    // Module quản lý đa ngôn ngữ Entity Framework
    typeof(AbpLocalizationManagementEntityFrameworkCoreModule),


    // Module tin nhắn dịch vụ miền
    typeof(AbpMessageServiceDomainModule),
    // Module tin nhắn dịch vụ ứng dụng
    typeof(AbpMessageServiceApplicationModule),
    // Module tin nhắn bộ điều khiển
    typeof(AbpMessageServiceHttpApiModule),
    // Module tin nhắn Entity Framework
    typeof(AbpMessageServiceEntityFrameworkCoreModule),
    // Module thông báo dịch vụ miền
    typeof(AbpNotificationsDomainModule),
    // Module thông báo dịch vụ ứng dụng
    typeof(AbpNotificationsApplicationModule),
    // Module thông báo bộ điều khiển
    typeof(AbpNotificationsHttpApiModule),
    // Module thông báo Entity Framework
    typeof(AbpNotificationsEntityFrameworkCoreModule),

    // Module mở rộng OpenIddict dịch vụ ứng dụng
    typeof(AbpOpenIddictApplicationModule),
    // Module mở rộng OpenIddict bộ điều khiển
    typeof(AbpOpenIddictHttpApiModule),
    // Module mở rộng OpenIddict Entity Framework
    typeof(AbpOpenIddictEntityFrameworkCoreModule),
    // Module mở rộng OpenIddict xác thực SMS
    typeof(AbpOpenIddictSmsModule),
    // Module mở rộng OpenIddict xác thực nền tảng
    typeof(AbpOpenIddictPortalModule),
    // Module mở rộng OpenIddict xác thực WeChat
    typeof(AbpOpenIddictWeChatModule),
    // Module mở rộng OpenIddict xác thực WeChat doanh nghiệp
    typeof(AbpOpenIddictWeChatWorkModule),
    // Module mở rộng OpenIddict tài khoản liên kết
    typeof(AbpOpenIddictLinkUserModule),
    // Module mở rộng OpenIddict đăng nhập bằng quét mã
    typeof(AbpOpenIddictQrCodeModule),

    // Module lưu trữ đối tượng Alibaba Cloud
    typeof(AbpBlobManagementAliyunModule),
    // Module lưu trữ đối tượng hệ thống tệp
    typeof(AbpBlobManagementFileSystemModule),
    // Module lưu trữ đối tượng Minio
    typeof(AbpBlobManagementMinioModule),
    // Module lưu trữ đối tượng Tencent Cloud
    typeof(AbpBlobManagementTencentModule),
    // Module lưu trữ đối tượng mở rộng MimeCheck
    typeof(AbpBlobManagementMimeCheckModule),
    // Module lưu trữ đối tượng dịch vụ ứng dụng
    typeof(AbpBlobManagementDomainModule),
    // Module lưu trữ đối tượng bộ điều khiển
    typeof(AbpBlobManagementApplicationModule),
    // Module lưu trữ đối tượng bộ điều khiển
    typeof(AbpBlobManagementHttpApiModule),
    // Module lưu trữ đối tượng quản lý cài đặt
    typeof(AbpBlobManagementSettingManagementModule),
    // Module lưu trữ đối tượng đại lý lưu trữ chung
    typeof(AbpBlobStoringBlobManagementModule),
    // Module xử lý đồ họa
    typeof(AbpImagingImageSharpModule),

    // Module nền tảng dịch vụ miền
    typeof(PlatformDomainModule),
    // Module nền tảng dịch vụ ứng dụng
    typeof(PlatformApplicationModule),
    // Module nền tảng bộ điều khiển
    typeof(PlatformHttpApiModule),
    // Module nền tảng Entity Framework
    typeof(PlatformEntityFrameworkCoreModule),
    // Module nền tảng cài đặt VueVbenAdmin
    // typeof(PlatformSettingsVueVbenAdminModule),
    // Module nền tảng chủ đề VueVbenAdmin
    // typeof(PlatformThemeVueVbenAdminModule),
    // Module nền tảng tuyến đường Vben2
    // typeof(AbpUINavigationVueVbenAdminModule),
    // Module nền tảng tuyến đường Vben5
    typeof(AbpUINavigationVueVbenAdmin5Module),

    // Module Saas dịch vụ miền
    typeof(AbpSaasDomainModule),
    // Module Saas dịch vụ ứng dụng
    typeof(AbpSaasApplicationModule),
    // Module Saas bộ điều khiển
    typeof(AbpSaasHttpApiModule),
    // Module Saas Entity Framework
    typeof(AbpSaasEntityFrameworkCoreModule),
    // Module Saas kiểm tra kết nối cơ sở dữ liệu
    typeof(AbpSaasDbCheckerModule),

    // Module quản lý tác vụ dịch vụ miền
    typeof(TaskManagementDomainModule),
    // Module quản lý tác vụ dịch vụ ứng dụng
    typeof(TaskManagementApplicationModule),
    // Module quản lý tác vụ bộ điều khiển
    typeof(TaskManagementHttpApiModule),
    // Module quản lý tác vụ Entity Framework
    typeof(TaskManagementEntityFrameworkCoreModule),

    // Module mẫu văn bản dịch vụ miền
    typeof(AbpTextTemplatingDomainModule),
    // Module mẫu văn bản dịch vụ ứng dụng
    typeof(AbpTextTemplatingApplicationModule),
    // Module mẫu văn bản bộ điều khiển
    typeof(AbpTextTemplatingHttpApiModule),
    // Module mẫu văn bản Entity Framework
    typeof(AbpTextTemplatingEntityFrameworkCoreModule),

    // Module Webhooks dịch vụ miền
    typeof(AbpWebhooksModule),
    // Module Webhooks bus sự kiện
    typeof(AbpWebhooksEventBusModule),
    // Module Webhooks sự kiện xác thực danh tính
    typeof(AbpWebhooksIdentityModule),
    // Module Webhooks sự kiện Saas
    typeof(AbpWebhooksSaasModule),
    // Module Webhooks dịch vụ ứng dụng
    typeof(WebhooksManagementDomainModule),
    // Module Webhooks bộ điều khiển
    typeof(WebhooksManagementApplicationModule),
    // Module Webhooks bộ điều khiển
    typeof(WebhooksManagementHttpApiModule),
    // Module Webhooks Entity Framework
    typeof(WebhooksManagementEntityFrameworkCoreModule),

    // Module quản lý tính năng dịch vụ ứng dụng
    typeof(LINGYUN.Abp.FeatureManagement.AbpFeatureManagementApplicationModule),
    // Module quản lý tính năng bộ điều khiển
    typeof(LINGYUN.Abp.FeatureManagement.HttpApi.AbpFeatureManagementHttpApiModule),
    // Module quản lý tính năng Entity Framework
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),

    // Module quản lý cài đặt dịch vụ miền
    typeof(AbpSettingManagementDomainModule),
    // Module quản lý cài đặt dịch vụ ứng dụng
    typeof(AbpSettingManagementApplicationModule),
    // Module quản lý cài đặt bộ điều khiển
    typeof(AbpSettingManagementHttpApiModule),
    // Module quản lý cài đặt Entity Framework
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    // Module quản lý cài đặt giao diện Mvc
    typeof(AbpSettingManagementWebModule),

    // Module quản lý quyền dịch vụ ứng dụng
    typeof(LINGYUN.Abp.PermissionManagement.AbpPermissionManagementApplicationModule),
    // Module quản lý quyền bộ điều khiển
    typeof(AbpPermissionManagementHttpApiModule),
    // Module quản lý quyền tích hợp xác thực danh tính
    typeof(AbpPermissionManagementDomainIdentityModule),
    // Module quản lý quyền tích hợp OpenIddict
    typeof(AbpPermissionManagementDomainOpenIddictModule),
    // typeof(AbpPermissionManagementDomainIdentityServerModule),
    // Module quản lý quyền Entity Framework
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    // Module quản lý quyền tích hợp tổ chức
    typeof(AbpPermissionManagementDomainOrganizationUnitsModule), // Quản lý quyền tổ chức
    // Module quản lý quyền giao diện Mvc
    typeof(AbpPermissionManagementWebModule),

    // Module SMS tích hợp Alibaba Cloud
    typeof(AbpAliyunSmsModule),
    // Module Alibaba Cloud quản lý cài đặt
    typeof(AbpAliyunSettingManagementModule),

    // Module xác thực JWT
    typeof(AbpAspNetCoreAuthenticationJwtBearerModule),
    // Module ủy quyền tích hợp tổ chức
    typeof(AbpAuthorizationOrganizationUnitsModule),

    // Module tác vụ nền
    typeof(AbpBackgroundTasksModule),
    // Module tác vụ nền xử lý hành vi
    typeof(AbpBackgroundTasksActivitiesModule),
    // Module tác vụ nền khóa phân tán
    typeof(AbpBackgroundTasksDistributedLockingModule),
    // Module tác vụ nền bus sự kiện
    typeof(AbpBackgroundTasksEventBusModule),
    // Module tác vụ nền công việc mặc định
    typeof(AbpBackgroundTasksJobsModule),
    // Module tác vụ nền thông báo
    typeof(AbpBackgroundTasksNotificationsModule),
    // Module tác vụ nền tích hợp Quartz
    typeof(AbpBackgroundTasksQuartzModule),
    // Module tác vụ nền công việc module xác thực danh tính
    typeof(AbpIdentityJobsModule),
    // Module tác vụ nền công việc module quản lý nền tảng
    typeof(PlatformJobsModule),

    // Module kiểm tra dữ liệu dịch vụ ứng dụng
    typeof(AbpDataProtectionManagementApplicationModule),
    // Module kiểm tra dữ liệu bộ điều khiển
    typeof(AbpDataProtectionManagementHttpApiModule),
    // Module kiểm tra dữ liệu Entity Framework
    typeof(AbpDataProtectionManagementEntityFrameworkCoreModule),

    // Module Demo dịch vụ ứng dụng
    typeof(AbpDemoApplicationModule),
    // Module Demo bộ điều khiển
    typeof(AbpDemoHttpApiModule),
    // Module Demo Entity Framework
    typeof(AbpDemoEntityFrameworkCoreModule),

    // Module Dapr máy khách
    typeof(AbpDaprClientModule),
    // Module xử lý ngoại lệ
    typeof(AbpExceptionHandlingModule),
    // Module xử lý ngoại lệ thông báo email
    typeof(AbpEmailingExceptionHandlingModule),

    // Module giới hạn tính năng
    typeof(AbpFeaturesLimitValidationModule),
    // Module giới hạn tính năng máy khách tích hợp Redis
    typeof(AbpFeaturesValidationRedisClientModule),
    // Module quản lý tính năng giao diện Mvc
    typeof(AbpFeatureManagementWebModule),
    // Module đa ngôn ngữ ánh xạ ngôn ngữ
    typeof(AbpLocalizationCultureMapModule),

    // Module OpenApi ủy quyền
    typeof(AbpOpenApiAuthorizationModule),

    // Module tin nhắn khung thời gian thực
    typeof(AbpIMSignalRModule),

    // Module thông báo
    typeof(AbpNotificationsModule),
    // Module thông báo mặc định
    typeof(AbpNotificationsCommonModule),
    // Module thông báo khung thời gian thực
    typeof(AbpNotificationsSignalRModule),
    // Module thông báo email
    typeof(AbpNotificationsEmailingModule),
    // Module thông báo phân tích mẫu
    typeof(AbpNotificationsTemplatingModule),
    // Module thông báo Mini Program WeChat
    typeof(AbpNotificationsWeChatMiniProgramModule),
    // Module thông báo WeChat doanh nghiệp
    typeof(AbpNotificationsWeChatWorkModule),
    // Module thông báo bộ chặn kiểm tra ngày làm việc
    typeof(AbpNotificationsCalendarModule),
    // Module đa tenant phiên bản
    typeof(AbpMultiTenancyEditionsModule),

    // Module Tencent QQ
    typeof(AbpTencentQQModule),
    // Module Tencent Cloud quản lý cài đặt
    typeof(AbpTencentCloudSettingManagementModule),

    // Module WeChat Mini Program
    typeof(AbpWeChatMiniProgramModule),
    // Module WeChat tài khoản công khai
    typeof(AbpWeChatOfficialModule),
    // Module WeChat tài khoản công khai dịch vụ ứng dụng
    typeof(AbpWeChatOfficialApplicationModule),
    // Module WeChat tài khoản công khai bộ điều khiển
    typeof(AbpWeChatOfficialHttpApiModule),
    // Module WeChat doanh nghiệp
    typeof(AbpWeChatWorkModule),
    // Module WeChat doanh nghiệp danh bạ
    typeof(AbpWeChatWorkContactModule),
    // Module WeChat doanh nghiệp liên hệ khách hàng
    typeof(AbpWeChatWorkExternalContactModule),
    // Module WeChat doanh nghiệp văn phòng
    typeof(AbpWeChatWorkOAModule),
    // Module WeChat doanh nghiệp dịch vụ ứng dụng
    typeof(AbpWeChatWorkApplicationModule),
    // Module WeChat doanh nghiệp bộ điều khiển
    typeof(AbpWeChatWorkHttpApiModule),
    // Module WeChat tài khoản công khai xử lý sự kiện
    typeof(AbpWeChatOfficialHandlersModule),
    // Module WeChat doanh nghiệp xử lý sự kiện
    typeof(AbpWeChatWorkHandlersModule),
    // Module WeChat quản lý cài đặt
    typeof(AbpWeChatSettingManagementModule),

    // Module quản lý AI công cụ Http
    typeof(AbpAIToolsHttpModule),
    // Module quản lý AI công cụ Mcp
    typeof(AbpAIToolsMcpModule),
    // Module quản lý AI dịch vụ ứng dụng
    typeof(AbpAIManagementApplicationModule),
    // Module quản lý AI bộ điều khiển
    typeof(AbpAIManagementHttpApiModule),

    // Module di chuyển dữ liệu
    typeof(AbpDataDbMigratorModule),
    // Module phân giải IP tích hợp IP2Region
    typeof(AbpIP2RegionModule),
    // Module trình tạo Id phân tán
    typeof(AbpIdGeneratorModule),
    // Module điều hướng tùy chỉnh
    typeof(AbpUINavigationModule),

    // Module quy trình làm việc Elsa
    typeof(AbpElsaModule),
    // Module quy trình làm việc Elsa máy chủ quy trình làm việc
    typeof(AbpElsaServerModule),
    // Module quy trình làm việc Elsa hoạt động
    typeof(AbpElsaActivitiesModule),
    // Module quy trình làm việc Elsa Entity Framework
    typeof(AbpElsaEntityFrameworkCoreModule),
    // Module trình thiết kế quy trình làm việc Elsa
    typeof(AbpElsaDesignerModule),

    // Module xuất dữ liệu tích hợp MiniSoftware
    typeof(AbpExporterMiniSoftwareModule),

    // Trình duyệt tệp ảo giao diện Mvc
    typeof(AbpVirtualFileExplorerWebModule),
    typeof(AbpLoggingSerilogElasticsearchModule),
    typeof(AbpHttpClientWrapperModule),
    typeof(AbpAspNetCoreMvcWrapperModule),
    typeof(AbpAspNetCoreSessionModule),
    typeof(AbpAspNetCoreMvcIdempotentWrapperModule),
    typeof(AbpAspNetCoreHttpOverridesModule),
    typeof(AbpHttpClientIdentityModelWebModule),
    typeof(AbpAspNetCoreMultiTenancyModule),
    typeof(AbpAspNetCoreMvcUiMultiTenancyModule),
    typeof(AbpDynamicDefinitionsModule),
    typeof(AbpAspNetCoreAuthenticationModule),
    typeof(AbpTelemetryOpenTelemetryModule),
    typeof(AbpSwashbuckleModule),
    typeof(AbpMailKitModule),
    typeof(AbpAutofacModule),

    // Giao diện trạng thái hệ thống ứng dụng đơn khối
    typeof(AbpSystemInfoHttpApiModule),

    // MySql
     typeof(SingleMigrationsEntityFrameworkCoreMySqlModule),
    // SqlServer
    typeof(SingleMigrationsEntityFrameworkCoreSqlServerModule),
    // PostgreSql
    typeof(SingleMigrationsEntityFrameworkCorePostgreSqlModule),

    // Module nhật ký kiểm tra dịch vụ ứng dụng
    typeof(AbpAuditingApplicationModule),
    // Module nhật ký kiểm tra bộ điều khiển
    typeof(AbpAuditingHttpApiModule),
    // Module nhật ký kiểm tra định vị địa chỉ IP
    typeof(AbpAuditLoggingIPLocationModule),
    // Module nhật ký kiểm tra triển khai Entity Framework
    typeof(AbpAuditLoggingEntityFrameworkCoreModule),
    // Module nhật ký kiểm tra triển khai Elasticsearch
    // typeof(AbpAuditLoggingElasticsearchModule),
    // Module nhật ký kiểm tra triển khai OpenObserve
    // typeof(AbpAuditLoggingOpenObserveModule),
    // Module nhật ký hệ thống Elasticsearch
    typeof(AbpLoggingSerilogElasticsearchModule),
    // Module nhật ký hệ thống OpenObserve
    typeof(AbpLoggingSerilogOpenObserveModule)
    )]
public partial class AllInOneModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();
        var hostingEnvironment = context.Services.GetHostingEnvironment();

        PreConfigureWrapper();
        PreConfigureFeature();
        PreConfigureIdentity();
        PreConfigureApp(configuration);
        PreConfigureCAP(configuration);
        PreConfigureQuartz(configuration);
        PreConfigureSignalR(configuration);
        PreConfigureAuthServer(configuration);
        PreConfigureElsa(context.Services, configuration);
        PreConfigureCertificate(configuration, hostingEnvironment);
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        ConfigureWeChat();
        ConfigureWrapper();
        ConfigureExporter();
        ConfigureAuditing();
        ConfigureIdempotent();
        ConfigureMvcUiTheme();
        ConfigureLocalization();
        ConfigureBackgroundTasks();
        ConfigureExceptionHandling();
        ConfigureVirtualFileSystem();

        ConfigureEntityDataProtected();
        ConfigureUrls(configuration);
        ConfigureAuditing(configuration);
        ConfigureIdentity(configuration);
        ConfigureDbContext(configuration);
        ConfigureAuthServer(configuration, hostingEnvironment);
        ConfigureEndpoints(context.Services);
        ConfigureMultiTenancy(configuration);
        ConfigureJsonSerializer(configuration);
        ConfigureTextTemplating(configuration);
        ConfigureAIManagement(configuration);
        ConfigureFeatureManagement(configuration);
        ConfigureSettingManagement(configuration);
        ConfigureWebhooksManagement(configuration);
        ConfigurePermissionManagement(configuration);
        ConfigureNotificationManagement(configuration);
        ConfigureCors(context.Services, configuration);
        ConfigureSwagger(context.Services, configuration);
        ConfigureCaching(context.Services, configuration);
        ConfigureDistributedLock(context.Services, configuration);
        ConfigureKestrelServer(configuration, hostingEnvironment);
        ConfigureSecurity(context.Services, configuration, hostingEnvironment.IsDevelopment());

        ConfigureSingleModule(context.Services, hostingEnvironment.IsDevelopment());
    }

    public async override Task OnPostApplicationInitializationAsync(ApplicationInitializationContext context)
    {
        await context.ServiceProvider
            .GetRequiredService<IDataSeeder>()
            .SeedAsync();
    }
}
