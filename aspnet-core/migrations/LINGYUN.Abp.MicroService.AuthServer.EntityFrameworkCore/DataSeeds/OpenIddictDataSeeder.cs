using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using OpenIddict.Abstractions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.OpenIddict;
using Volo.Abp.OpenIddict.Applications;
using Volo.Abp.OpenIddict.Scopes;
using Volo.Abp.PermissionManagement;

namespace LINGYUN.Abp.MicroService.AuthServer.EntityFrameworkCore.DataSeeds;

public class OpenIddictDataSeeder : OpenIddictDataSeedContributorBase, ITransientDependency
{
    public ILogger<OpenIddictDataSeeder> Logger { protected get; set; }
    protected IPermissionDataSeeder PermissionDataSeeder { get; }
    public OpenIddictDataSeeder(
        IConfiguration configuration,
        IOpenIddictApplicationRepository openIddictApplicationRepository,
        IAbpApplicationManager applicationManager,
        IOpenIddictScopeRepository openIddictScopeRepository,
        IOpenIddictScopeManager scopeManager,
        IPermissionDataSeeder permissionDataSeeder)
        : base(configuration, openIddictApplicationRepository, applicationManager, openIddictScopeRepository, scopeManager)
    {
        PermissionDataSeeder = permissionDataSeeder;

        Logger = NullLogger<OpenIddictDataSeeder>.Instance;
    }

    public async virtual Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId.HasValue)
        {
            return;
        }
        var applicationScope = "lingyun-abp-application";

        Logger.LogInformation("Seeding the default scope...");
        await CreateDefaultScopeAsync();
        await CreateApiScopesAsync(applicationScope);

        Logger.LogInformation("Seeding the default applications...");
        await CreateApplicationAsync(applicationScope);

        Logger.LogInformation("Seeding default applications completed.");
    }

    private async Task CreateDefaultScopeAsync()
    {
        // OpenId Connect
        await CreateServiceScopeAsync(
            OpenIddictConstants.Scopes.OpenId,
            "OpenId Connect",
            "Xác thực danh tính",
            "OpenId Connect",
            "Xác thực bằng giao thức OpenId Connect",
            "Cho phép ứng dụng sử dụng thông tin danh tính của bạn để đăng nhập",
            "Allow the application to authenticate you using OpenID Connect");

        // Profile
        await CreateServiceScopeAsync(
            OpenIddictConstants.Scopes.Profile,
            "Hồ sơ cá nhân",
            "Hồ sơ cá nhân",
            "Profile",
            "Truy cập thông tin hồ sơ cá nhân cơ bản của bạn",
            "Cho phép ứng dụng truy cập các thông tin cơ bản của bạn như tên, ảnh đại diện",
            "Allow the application to access your basic profile information like name and picture");

        // Email
        await CreateServiceScopeAsync(
            OpenIddictConstants.Scopes.Email,
            "Email",
            "Email",
            "Email",
            "Truy cập địa chỉ email của bạn",
            "Cho phép ứng dụng truy cập địa chỉ email của bạn",
            "Allow the application to access your email address");

        // Phone
        await CreateServiceScopeAsync(
            OpenIddictConstants.Scopes.Phone,
            "Số điện thoại",
            "Số điện thoại",
            "Phone",
            "Truy cập số điện thoại của bạn",
            "Cho phép ứng dụng truy cập số điện thoại của bạn",
            "Allow the application to access your phone number");

        // Address
        await CreateServiceScopeAsync(
            OpenIddictConstants.Scopes.Address,
            "Thông tin địa chỉ",
            "Thông tin địa chỉ",
            "Address",
            "Truy cập thông tin địa chỉ của bạn",
            "Cho phép ứng dụng truy cập thông tin địa chỉ của bạn",
            "Allow the application to access your address information");

        // Roles
        await CreateServiceScopeAsync(
            OpenIddictConstants.Scopes.Roles,
            "Thông tin vai trò",
            "Thông tin vai trò",
            "Roles",
            "Truy cập thông tin vai trò của bạn",
            "Cho phép ứng dụng truy cập thông tin vai trò và quyền của bạn",
            "Allow the application to access your roles and permissions");

        // OfflineAccess
        await CreateServiceScopeAsync(
            OpenIddictConstants.Scopes.OfflineAccess,
            "Truy cập ngoại tuyến",
            "Truy cập ngoại tuyến",
            "Offline access",
            "Truy cập thông tin của bạn khi bạn chưa đăng nhập",
            "Cho phép ứng dụng truy cập thông tin của bạn khi bạn chưa đăng nhập",
            "Allow the application to access your information while you are offline");
    }

    private async Task CreateApiScopesAsync(string scope)
    {
        // Phạm vi ủy quyền tổng hợp của frontend
        await CreateServiceScopeAsync(
            scope,
            "Ủy quyền truy cập microservice",
            "Ủy quyền truy cập microservice",
            "MicroService applications access",
            "Ủy quyền giao diện áp dụng cho hệ thống microservice",
            "Cho phép ứng dụng sử dụng giao diện của từng mô-đun microservice",
            "Allow the application to use the interfaces of each microservice module",
            [
                "api-gateway",
                "auth-server",
                "admin-service",
                "ai-service",
                "identity-service",
                "localization-service",
                "message-service",
                "platform-service",
                "task-service",
                "webhook-service",
                "wechat-service",
                "workflow-service"
             ]);
        // ApiGateway Swagger
        await CreateServiceScopeAsync(
            "api-gateway",
            "Api Gateway",
            "Cổng giao diện ứng dụng",
            "Api Gateway",
            "Ủy quyền Swagger áp dụng cho cổng giao diện ứng dụng",
            "Ủy quyền Swagger áp dụng cho cổng giao diện ứng dụng",
            "Applicable to application Programming interface gateway Swagger authorization",
            ["api-gateway"]);
        // Admin Service
        await CreateServiceScopeAsync(
            "admin-service",
            "Admin Service",
            "Dịch vụ quản trị hệ thống",
            "Admin Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản trị hệ thống",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản trị hệ thống",
            "Applicable to the back-end management service Swagger authorization",
            ["admin-service"]);
        // Auth Server
        await CreateServiceScopeAsync(
            "auth-server",
            "Auth Server",
            "Máy chủ xác thực danh tính",
            "Auth Server",
            "Ủy quyền Swagger áp dụng cho máy chủ xác thực danh tính",
            "Ủy quyền Swagger áp dụng cho máy chủ xác thực danh tính",
            "Applicable to the auth server Swagger authorization",
            ["auth-server"]);
        // Identity Service
        await CreateServiceScopeAsync(
            "identity-service",
            "Identity Service",
            "Dịch vụ xác thực danh tính",
            "Identity Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ xác thực danh tính",
            "Ủy quyền Swagger áp dụng cho dịch vụ xác thực danh tính",
            "Applicable to the identity service Swagger authorization",
            ["identity-service"]);
        // Localization Service
        await CreateServiceScopeAsync(
            "localization-service",
            "Localization Service",
            "Dịch vụ quản lý bản địa hóa",
            "Localization Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý bản địa hóa",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý bản địa hóa",
            "Applicable to the Localization service Swagger authorization",
            ["localization-service"]);
        // Message Service
        await CreateServiceScopeAsync(
            "message-service",
            "Message Service",
            "Dịch vụ quản lý tin nhắn",
            "Message Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý tin nhắn",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý tin nhắn",
            "Applicable to the Message service Swagger authorization",
            ["message-service"]);
        // Platform Service
        await CreateServiceScopeAsync(
            "platform-service",
            "Platform Service",
            "Dịch vụ quản lý nền tảng",
            "Platform Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý nền tảng",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý nền tảng",
            "Applicable to the Platform service Swagger authorization",
            ["platform-service"]);
        // Task Service
        await CreateServiceScopeAsync(
            "task-service",
            "Task Service",
            "Dịch vụ quản lý tác vụ",
            "Task Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý tác vụ",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý tác vụ",
            "Applicable to the Task service Swagger authorization",
            ["task-service"]);
        // Webhook Service
        await CreateServiceScopeAsync(
            "webhook-service",
            "Webhook Service",
            "Dịch vụ quản lý Webhook",
            "Webhook Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý Webhook",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý Webhook",
            "Applicable to the Webhook service Swagger authorization",
            ["webhook-service"]);
        // Wechat Service
        await CreateServiceScopeAsync(
            "wechat-service",
            "Wechat Service",
            "Dịch vụ quản lý WeChat",
            "Wechat Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý WeChat",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý WeChat",
            "Applicable to the Wechat service Swagger authorization",
            ["wechat-service"]);
        // Workflow Service
        await CreateServiceScopeAsync(
            "workflow-service",
            "Workflow Service",
            "Dịch vụ quản lý quy trình làm việc",
            "Workflow Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý quy trình làm việc",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý quy trình làm việc",
            "Applicable to the Workflow service Swagger authorization",
            ["workflow-service"]);
        // AI Service
        await CreateServiceScopeAsync(
            "ai-service",
            "Artificial Intelligence Service",
            "Dịch vụ quản lý AI",
            "Artificial Intelligence Service",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý AI",
            "Ủy quyền Swagger áp dụng cho dịch vụ quản lý AI",
            "Applicable to the Artificial Intelligence service Swagger authorization",
            ["ai-service"]);
    }

    private async Task CreateApplicationAsync(string scope)
    {
        var configurationSection = Configuration.GetSection("OpenIddict:Applications");
        var vueClientId = configurationSection["VueAdmin:ClientId"];
        if (!vueClientId.IsNullOrWhiteSpace())
        {
            Logger.LogInformation("Seeding application {vueClientId}...", vueClientId);

            var vueClientRootUrls = configurationSection.GetSection("VueAdmin:RootUrls").Get<List<string>>() ?? [];

            var vueClientRedirectUrls = new List<string>();
            var vueClientPostLogoutRedirectUrls = new List<string>();
            vueClientRootUrls.ForEach(url =>
            {
                vueClientRedirectUrls.Add(url.EnsureEndsWith('/'));
                vueClientRedirectUrls.Add(url.EnsureEndsWith('/') + "signin-callback");

                vueClientPostLogoutRedirectUrls.Add(url.EnsureEndsWith('/'));
                vueClientPostLogoutRedirectUrls.Add(url.EnsureEndsWith('/') + "signout-callback");
            });

            await CreateOrUpdateApplicationAsync(
                OpenIddictConstants.ApplicationTypes.Web,
                vueClientId,
                OpenIddictConstants.ClientTypes.Confidential,
                OpenIddictConstants.ConsentTypes.Explicit,
                "Abp Vue Admin Client",
                configurationSection["VueAdmin:ClientSecret"] ?? "1q2w3e*",
                [OpenIddictConstants.GrantTypes.AuthorizationCode,
                OpenIddictConstants.GrantTypes.Password,
                OpenIddictConstants.GrantTypes.RefreshToken,
                // TODO: Tham chiếu dự án?
                "link_user",
                "impersonation"],
                [OpenIddictConstants.Scopes.OpenId,
                OpenIddictConstants.Scopes.Email,
                OpenIddictConstants.Scopes.Roles,
                OpenIddictConstants.Scopes.Address,
                OpenIddictConstants.Scopes.Phone,
                OpenIddictConstants.Scopes.Profile,
                OpenIddictConstants.Scopes.OfflineAccess,
                 scope],
                vueClientRedirectUrls,
                vueClientPostLogoutRedirectUrls);

            var vueClientPermissions = new string[1]
            {
                "AbpIdentity.UserLookup"
            };
            await PermissionDataSeeder.SeedAsync(ClientPermissionValueProvider.ProviderName, vueClientId, vueClientPermissions);
        }

        var internalServiceClientId = configurationSection["InternalService:ClientId"];
        if (!internalServiceClientId.IsNullOrWhiteSpace())
        {
            Logger.LogInformation("Seeding application {internalServiceClientId}...", internalServiceClientId);

            await CreateOrUpdateApplicationAsync(
                OpenIddictConstants.ApplicationTypes.Web,
                internalServiceClientId,
                OpenIddictConstants.ClientTypes.Confidential,
                OpenIddictConstants.ConsentTypes.Implicit,
                "Abp Internal Service Client",
                configurationSection["InternalService:ClientSecret"] ?? "1q2w3e*",
                [OpenIddictConstants.GrantTypes.ClientCredentials],
                [scope]);
        }

        var oauthClientId = configurationSection["VueOAuthClient:ClientId"];
        if (!oauthClientId.IsNullOrWhiteSpace())
        {
            Logger.LogInformation("Seeding application {oauthClientId}...", oauthClientId);

            var oauthClientRootUrls = configurationSection.GetSection("VueOAuthClient:RootUrls").Get<List<string>>() ?? [];

            var oauthClientRedirectUrls = new List<string>();
            var oauthClientPostLogoutRedirectUrls = new List<string>();
            oauthClientRootUrls.ForEach(url =>
            {
                oauthClientRedirectUrls.Add(url.EnsureEndsWith('/'));
                oauthClientRedirectUrls.Add(url.EnsureEndsWith('/') + "signin-callback");
                oauthClientRedirectUrls.Add(url.EnsureEndsWith('/') + "swagger/oauth2-redirect.html");

                oauthClientPostLogoutRedirectUrls.Add(url.EnsureEndsWith('/'));
                oauthClientPostLogoutRedirectUrls.Add(url.EnsureEndsWith('/') + "signout-callback");
            });

            await CreateOrUpdateApplicationAsync(
                OpenIddictConstants.ApplicationTypes.Web,
                oauthClientId,
                OpenIddictConstants.ClientTypes.Public,
                OpenIddictConstants.ConsentTypes.Implicit,
                "Abp OAuth Client",
                null,
                [OpenIddictConstants.GrantTypes.AuthorizationCode,
                 OpenIddictConstants.GrantTypes.RefreshToken,
                "link_user",
                "impersonation"],
                [OpenIddictConstants.Scopes.OpenId,
                OpenIddictConstants.Scopes.Email,
                OpenIddictConstants.Scopes.Roles,
                OpenIddictConstants.Scopes.Address,
                OpenIddictConstants.Scopes.Phone,
                OpenIddictConstants.Scopes.Profile,
                OpenIddictConstants.Scopes.OfflineAccess,
                 scope,
                 "api-gateway",
                "auth-server",
                "admin-service",
                "ai-service",
                "identity-service",
                "localization-service",
                "message-service",
                "platform-service",
                "task-service",
                "webhook-service",
                "wechat-service",
                "workflow-service"],
                oauthClientRedirectUrls,
                oauthClientPostLogoutRedirectUrls);

            var oauthClientPermissions = new string[1]
            {
                "AbpIdentity.UserLookup"
            };
            await PermissionDataSeeder.SeedAsync(ClientPermissionValueProvider.ProviderName, oauthClientId, oauthClientPermissions);
        }
    }

    private async Task CreateServiceScopeAsync(
        string name,
        string displayNameDefault,
        string displayNameZh,
        string displayNameEn,
        string descriptionDefault,
        string descriptionZh,
        string descriptionEn,
        List<string>? resources = null)
    {
        var descriptor = new OpenIddictScopeDescriptor
        {
            Name = name,
            DisplayName = displayNameDefault,
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = displayNameZh,
                [CultureInfo.GetCultureInfo("en")] = displayNameEn
            },
            Description = descriptionDefault,
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = descriptionZh,
                [CultureInfo.GetCultureInfo("en")] = descriptionEn
            },
        };
        if (resources is { Count: > 0 })
        {
            descriptor.Resources.AddIfNotContains(resources);
        }

        await CreateScopesAsync(descriptor);
    }
}
