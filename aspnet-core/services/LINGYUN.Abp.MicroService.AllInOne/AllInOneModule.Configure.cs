using Savorboard.CAP.InMemoryMessageQueue;
using Microsoft.AspNetCore.Routing;
using VoloAbpExceptionHandlingOptions = Volo.Abp.AspNetCore.ExceptionHandling.AbpExceptionHandlingOptions;

namespace LINGYUN.Abp.MicroService.AllInOne;

public partial class AllInOneModule
{
    public static string ApplicationName { get; set; } = "AllInOneService";
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

    private void PreConfigureCAP(IConfiguration configuration)
    {
        PreConfigure<CapOptions>(options =>
        {
            options.UseDashboard();
            if (!configuration.GetValue<bool>("CAP:IsEnabled"))
            {
                options
                    .UseInMemoryStorage()
                    .UseInMemoryMessageQueue();
                return;
            }
            options.UseRabbitMQ(rabbitMQOptions =>
            {
                configuration.GetSection("CAP:RabbitMQ").Bind(rabbitMQOptions);
            });
        });
    }

    private void PreConfigureAuthServer(IConfiguration configuration)
    {
        PreConfigure<OpenIddictBuilder>(builder =>
        {
            builder.AddValidation(options =>
            {
                var validAudiences = configuration.GetSection("AuthServer:ValidAudiences").Get<List<string>>();
                if (validAudiences?.Count > 0)
                {
                    foreach (var audience in validAudiences)
                    {
                        options.AddAudiences(audience);
                    }
                }

                options.UseLocalServer();

                options.UseAspNetCore();

                //options.UseDataProtection();
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
        if (!environment.IsDevelopment())
        {
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(builder =>
            {
                //builder.UseDataProtection();

                // SEC-03: không tắt yêu cầu transport security ngoài Development.
                // Production phải phục vụ token endpoint qua HTTPS (hoặc sau TLS terminator
                // với ForwardedHeaders); tắt yêu cầu này ở đây từng làm token endpoint
                // chấp nhận HTTP thuần ngay cả ở production.
                // SEC-17: App:SslPassword KHÔNG được ghi vào appsettings.json (SEC-02:
                // appsettings chỉ giữ placeholder rỗng). Khi deploy phải cấp qua biến môi
                // trường App__SslPassword hoặc user-secrets; thiếu password thì quá trình
                // khởi động fail-closed khi nạp file .pfx có mật khẩu — không được "sửa"
                // bằng cách ghi lại password vào appsettings.
                builder.AddProductionEncryptionAndSigningCertificate(configuration["App:SslFile"], configuration["App:SslPassword"]);
            });
        }
        else
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

                //builder.UseDataProtection();

                // Tắt HTTPS
                builder.UseAspNetCore()
                    .DisableTransportSecurityRequirement();
            });
        }
    }

    private void PreConfigureSignalR(IConfiguration configuration)
    {
        PreConfigure<ISignalRServerBuilder>(builder =>
        {
            var redisEnabled = configuration["SignalR:Redis:IsEnabled"];
            if (redisEnabled.IsNullOrEmpty() || bool.Parse(redisEnabled))
            {
                builder.AddStackExchangeRedis(redis =>
                {
                    var redisConfiguration = configuration["SignalR:Redis:Configuration"];
                    if (!redisConfiguration.IsNullOrEmpty())
                    {
                        redis.ConnectionFactory = async (writer) =>
                        {
                            return await ConnectionMultiplexer.ConnectAsync(redisConfiguration);
                        };
                    }
                });
            }
        });
    }

    private void PreConfigureQuartz(IConfiguration configuration)
    {
        PreConfigure<AbpQuartzOptions>(options =>
        {
            // Nếu dùng bộ nhớ bền vững thì cấu hình tầng bền vững của Quartz
            if (configuration.GetValue("Quartz:UsePersistentStore", false))
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

    private void PreConfigureElsa(IServiceCollection services, IConfiguration configuration)
    {
        var elsaSection = configuration.GetSection("Elsa");
        // Namespace của dự án này nằm dưới LINGYUN.Abp, dùng trực tiếp Elsa.* sẽ bị phân giải thành namespace LINGYUN.Abp.Elsa.*,
        // vì vậy ở đây dùng global:: để chỉ định kiểu trong gói Elsa
        var startups = new[]
            {
                typeof(global::Elsa.Activities.Console.Startup),
                typeof(global::Elsa.Activities.Http.Startup),
                typeof(global::Elsa.Activities.UserTask.Startup),
                typeof(global::Elsa.Activities.Temporal.Quartz.Startup),
                typeof(global::Elsa.Activities.Email.Startup),
                typeof(global::Elsa.Scripting.JavaScript.Startup),
                typeof(global::Elsa.Activities.Webhooks.Startup),
            };

        PreConfigure<ElsaOptionsBuilder>(elsa =>
        {
            elsa
                .AddActivitiesFrom<AllInOneModule>()
                .AddWorkflowsFrom<AllInOneModule>()
                .AddFeatures(startups, configuration)
                .ConfigureWorkflowChannels(options => elsaSection.GetSection("WorkflowChannels").Bind(options));

            elsa.DistributedLockingOptionsBuilder
                .UseProviderFactory(sp => name =>
                {
                    var provider = sp.GetRequiredService<IDistributedLockProvider>();

                    return provider.CreateLock(name);
                });
        });

        services.AddNotificationHandlersFrom<AllInOneModule>();

        PreConfigure<IMvcBuilder>(mvcBuilder =>
        {
            mvcBuilder.AddApplicationPartIfNotExists(typeof(global::Elsa.Webhooks.Api.Endpoints.List).Assembly);
        });
    }

    private void ConfigureAuthServer(IConfiguration configuration, IWebHostEnvironment environment)
    {
        // SEC-03: chỉ tắt yêu cầu transport security khi Development. Ở production
        // OpenIddict phải yêu cầu HTTPS; việc tắt vô điều kiện trước đây làm mọi
        // request (kể cả token endpoint) chấp nhận HTTP thuần.
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
    }

    private void ConfigureEndpoints(IServiceCollection services)
    {
        // DEVOPS iter-0001: AllInOne trước đây không có endpoint kiểm tra sức khỏe,
        // trong khi docker-compose.yml giả định /healthz cho mọi service. Thêm /healthz
        // theo đúng mẫu các microservice khác (AdminService...) để orchestrator và
        // health-check script có điểm kiểm tra thống nhất. Đường dẫn cố định "/healthz"
        // (không đọc App:HealthChecks như các service khác vì ConfigureEndpoints ở đây
        // không nhận IConfiguration).
        Configure<AbpEndpointRouterOptions>(options =>
        {
            options.EndpointConfigureActions.Add((builder) =>
            {
                builder.Endpoints.MapHealthChecks("/healthz");
            });
        });

        services.AddHealthChecks()
            // DEVOPS iter-0004 (DEV-11): /healthz trước đây rỗng (không check nào) nên
            // luôn 200 kể cả khi DB/Redis chết. Đăng ký check dependency thật tại đây;
            // xem HealthChecks/AllInOneHealthChecks.cs. Các microservice khác vẫn dùng
            // AddHealthChecks() trơ trụi — nhân rộng check này sang chúng là việc còn lại.
            .AddCheck<HealthChecks.DatabaseHealthCheck>("database")
            .AddCheck<HealthChecks.RedisHealthCheck>("redis");

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
        services.AddRazorPages();
        services.AddControllersWithViews();//.AddNewtonsoftJson();
    }

    private void ConfigureKestrelServer(IConfiguration configuration, IWebHostEnvironment environment)
    {
        Configure<KestrelServerOptions>(options =>
        {
            options.Limits.MaxRequestBodySize = null;
            options.Limits.MaxRequestBufferSize = null;
        });

        if (!environment.IsDevelopment())
        {
            Configure<KestrelServerOptions>(options =>
            {
                options.ConfigureHttpsDefaults(https =>
                {
                    // SEC-17: xem ghi chú ở PreConfigureCertificate — password của file
                    // .pfx này chỉ cấp qua biến môi trường App__SslPassword hoặc
                    // user-secrets, không bao giờ ghi vào appsettings.json.
                    https.ServerCertificate = X509CertificateLoader.LoadPkcs12FromFile(
                        configuration["App:SslFile"]!,
                        configuration["App:SslPassword"]);
                });
            });
        }
    }

    private void ConfigureBackgroundTasks()
    {
        Configure<AbpBackgroundTasksOptions>(options =>
        {
            options.NodeName = ApplicationName;
            options.JobCleanEnabled = true;
            options.JobFetchEnabled = true;
            options.JobCheckEnabled = true;
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
            options.MapExportSetting(typeof(BookDto), config =>
            {
                config.DynamicColumns = new[]
                {
                    // Bỏ qua một số trường
                    new DynamicExcelColumn(nameof(BookDto.AuthorId)){ Ignore = true },
                    new DynamicExcelColumn(nameof(BookDto.LastModificationTime)){ Ignore = true },
                    new DynamicExcelColumn(nameof(BookDto.LastModifierId)){ Ignore = true },
                    new DynamicExcelColumn(nameof(BookDto.CreationTime)){ Ignore = true },
                    new DynamicExcelColumn(nameof(BookDto.CreatorId)){ Ignore = true },
                    new DynamicExcelColumn(nameof(BookDto.Id)){ Ignore = true },
                };
            });
        });
    }
    /// <summary>
    /// Cấu hình quyền dữ liệu
    /// </summary>
    private void ConfigureEntityDataProtected()
    {
        Configure<DataProtectionManagementOptions>(options =>
        {
            options.AddEntities(typeof(DemoResource),
                new[]
                {
                    typeof(Book),
                });
        });
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

    private void ConfigureAIManagement(IConfiguration configuration)
    {
        Configure<AbpAICoreOptions>(options =>
        {
            options.ChatClientBuildActions.Add((_, __, builder) =>
            {
                return Task.FromResult(builder
                    .UseLogging()
                    .UseOpenTelemetry()
                    .UseDistributedCache());
            });
        });


        Configure<AbpAIAgentOptions>(options =>
        {
            options.AgentBuildActions.Add((_, builder) =>
            {
                return Task.FromResult(builder
                    .UseLogging()
                    .UseOpenTelemetry());
            });
        });

        if (configuration.GetValue<bool>("AIManagement:IsDynamicStoreEnabled"))
        {
            Configure<AIManagementOptions>(options =>
            {
                options.IsDynamicWorkspaceStoreEnabled = true;
                options.SaveStaticWorkspacesToDatabase = true;

                options.IsDynamicAIToolStoreEnabled = true;
                options.SaveStaticAIToolsToDatabase = true;
            });
        }
    }

    private void ConfigureDistributedLock(IServiceCollection services, IConfiguration configuration)
    {
        var distributedLockEnabled = configuration["DistributedLock:IsEnabled"];
        if (distributedLockEnabled.IsNullOrEmpty() || bool.Parse(distributedLockEnabled))
        {
            services.AddSingleton<IDistributedLockProvider>(_ =>
            {
                return new RedisDistributedSynchronizationProvider(
                    ConnectionMultiplexer.Connect(configuration["DistributedLock:Redis:Configuration"]!).GetDatabase());
            });
        }
    }

    private void ConfigureVirtualFileSystem()
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<AllInOneModule>("LINGYUN.Abp.MicroService.AllInOne");
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

    private void ConfigureDbContext(IConfiguration configuration)
    {
        Configure<AbpDbConnectionOptions>(options =>
        {
            // 
        });
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
            // Có gửi thông tin ngăn xếp hay không
            options.SendStackTrace = true;
            // Email nhận mặc định khi chưa chỉ định người nhận ngoại lệ
            // Chỉ định địa chỉ email của mình
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

    private void ConfigureCaching(IServiceCollection services, IConfiguration configuration)
    {
        Configure<AbpDistributedCacheOptions>(options =>
        {
            configuration.GetSection("DistributedCache").Bind(options);
        });

        Configure<RedisCacheOptions>(options =>
        {
            var redisConfig = ConfigurationOptions.Parse(options.Configuration!);
            options.ConfigurationOptions = redisConfig;
            options.InstanceName = configuration["Redis:InstanceName"];
        });

        services.AddSingleton<IConnectionMultiplexer>(sp => ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]!));
    }

    private void ConfigureMultiTenancy(IConfiguration configuration)
    {
        // Đa thuê bao (multi-tenant)
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
                    options.AddOnlyDomainTenantResolver(domain);
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

    private void ConfigureSwagger(IServiceCollection services, IConfiguration configuration)
    {
        // Swagger
        services.AddAbpSwaggerGenWithOAuth(
            configuration["AuthServer:Authority"]!,
            new Dictionary<string, string>
            {
                { configuration["AuthServer:Audience"]!, "Single APP"}
            },
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Single APP API", Version = "v1",
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
                            // TODO: Elsa 2.x không tương thích với Swashbuckle 6.x, bỏ qua tài liệu Swagger
                            return false;
                        }
                    }

                    return true;
                });
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

            options.DynamicClaims.AddIfNotContains(AbpClaimTypes.Picture);
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

            // Ánh xạ ngôn ngữ của vben admin
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
                typeof(AbpOpenIddictResource));
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
            options.IsDynamicLocalizationInitializerHost = true;
        });
    }

    private void ConfigureWrapper()
    {
        Configure<AbpWrapperOptions>(options =>
        {
            options.IsEnabled = true;
            // options.IsWrapUnauthorizedEnabled = true;
            options.IgnoreNamespaces.Add("Elsa");
            // Tin nhắn WeChat không được đóng gói (wrap)
            options.IgnoreNamespaces.Add("LINGYUN.Abp.WeChat");
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

    private void ConfigureSingleModule(IServiceCollection services, bool isDevelopment)
    {
        Configure<AbpBundlingOptions>(options =>
        {
            options.ScriptBundles
                .Configure(StandardBundles.Scripts.Global, bundle =>
                {
                    bundle.AddContributors(typeof(SingleGlobalScriptContributor));
                });

            options.StyleBundles
                .Configure(LeptonXLiteThemeBundles.Styles.Global, bundle =>
                {
                    bundle.AddFiles("/css/global-styles.css");
                });
        });

        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            // Cho phép bên thứ ba gọi dịch vụ tích hợp
            options.ExposeIntegrationServices = true;
        });

        Configure<AbpAspNetCoreSessionOptions>(options =>
        {
            // ABP 9.0 có thể lưu trữ khu vực IP đăng nhập, bật phân giải IP
            options.IsParseIpLocation = true;
        });

        // Dùng để gửi email tập trung của trung tâm tin nhắn
        services.Replace(
            ServiceDescriptor.Transient<Volo.Abp.Emailing.IEmailSender, PlatformEmailSender>());
        services.AddKeyedTransient<Volo.Abp.Emailing.IEmailSender, MailKitSmtpEmailSender>("DefaultEmailSender");

        // Dùng để gửi SMS tập trung của trung tâm tin nhắn
        services.Replace(
            ServiceDescriptor.Transient<Volo.Abp.Sms.ISmsSender, PlatformSmsSender>());
        services.AddKeyedSingleton<ISmsSender, AliyunSmsSender>("DefaultSmsSender");
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
                    options.Applications[appConfig.Key].Urls[urlsConfig.Key] = urlsConfig.Value!;
                }
            }
        });
    }

    private void ConfigureSecurity(IServiceCollection services, IConfiguration configuration, bool isDevelopment = false)
    {
        // SEC-10 (vòng security 14): khôi phục antiforgery validation mặc định của ABP
        // (AutoValidate = true). Trước đây AutoValidate = false khiến mọi API controller
        // chấp nhận cookie session mà không cần antiforgery token (CSRF same-site).
        // Đã chứng minh từ ABP 10.7.0 (Volo.Abp.AspNetCore.Mvc):
        // ShouldValidate chỉ validate khi request mang cookie Identity.Application, và
        // bỏ qua khi request không mang cookie nào — nên các SPA dùng bearer token
        // (app-antd: withCredentials=false) không bị ảnh hưởng, còn request dùng cookie
        // mà không có token sẽ bị chặn 400. Lưu ý: client nào POST /api bằng cookie
        // (vd: react-admin external/register với withCredentials:true) phải gửi kèm
        // antiforgery token, nếu không sẽ 400 sau thay đổi này.
        Configure<AbpAntiForgeryOptions>(options =>
        {
            options.AutoValidate = true;
        });

        services.ForwardIdentityAuthenticationForBearer(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);

        services.AddAuthentication()
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

        services.ConfigureApplicationCookie(options =>
        {
            options.Events.OnRedirectToLogin = (ctx) =>
            {
                if (ctx.Request.Path.HasValue && 
                    (ctx.Request.Path.Value.StartsWith("/api") ||
                    ctx.Request.Path.Value.StartsWith("/connect/token")))
                {
                    ctx.Response.Clear();
                    ctx.Response.StatusCode = 401;
                    return Task.FromResult(0);
                }

                string authorization = ctx.Request.Headers.Authorization.ToString();
                if (!authorization.IsNullOrWhiteSpace() &&
                    authorization.StartsWith("Bearer ", StringComparison.InvariantCultureIgnoreCase))
                {
                    ctx.Response.Clear();
                    ctx.Response.ContentType = "application/json";
                    ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                }

                ctx.Response.Redirect(ctx.RedirectUri);
                return Task.CompletedTask;
            };
        });

        if (!isDevelopment)
        {
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

        services.AddSameSiteCookiePolicy();
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

    private void ConfigureWeChat()
    {
        Configure<AbpWeChatMessageHandleOptions>(options =>
        {
            // Trả lời tin nhắn văn bản
            options.MapMessage<
                LINGYUN.Abp.WeChat.Official.Messages.Models.TextMessage,
                LINGYUN.Abp.MicroService.AllInOne.WeChat.Official.Messages.TextMessageReplyContributor>();
            // Xử lý sự kiện theo dõi
            options.MapEvent<
                LINGYUN.Abp.WeChat.Official.Messages.Models.UserSubscribeEvent,
                LINGYUN.Abp.MicroService.AllInOne.WeChat.Official.Messages.UserSubscribeEventContributor>();

            options.MapMessage<
                LINGYUN.Abp.WeChat.Work.Common.Messages.Models.TextMessage,
                LINGYUN.Abp.MicroService.AllInOne.WeChat.Work.Messages.TextMessageReplyContributor>();
        });
    }
}

