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

namespace LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.DataSeeder;
public class OpenIddictDataSeederContributor : OpenIddictDataSeedContributorBase, IDataSeedContributor, ITransientDependency
{
    public ILogger<OpenIddictDataSeederContributor> Logger { protected get; set; }
    protected IPermissionDataSeeder PermissionDataSeeder { get; }
    public OpenIddictDataSeederContributor(
        IConfiguration configuration, 
        IOpenIddictApplicationRepository openIddictApplicationRepository, 
        IAbpApplicationManager applicationManager, 
        IOpenIddictScopeRepository openIddictScopeRepository, 
        IOpenIddictScopeManager scopeManager,
        IPermissionDataSeeder permissionDataSeeder) 
        : base(configuration, openIddictApplicationRepository, applicationManager, openIddictScopeRepository, scopeManager)
    {
        PermissionDataSeeder = permissionDataSeeder;

        Logger = NullLogger<OpenIddictDataSeederContributor>.Instance;
    }

    public async virtual Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId.HasValue)
        {
            return;
        }
        var scope = "lingyun-abp-application";

        Logger.LogInformation("Seeding the default scope...");
        await CreateDefaultScopeAsync();
        await CreateApiScopeAsync(scope, "all_in_one");

        Logger.LogInformation("Seeding the default applications...");
        await CreateApplicationAsync(scope);

        Logger.LogInformation("Seeding default applications completed.");
    }

    private async Task CreateDefaultScopeAsync()
    {
        // scope lõi OpenID Connect - dùng để xác định đây là một yêu cầu OIDC
        await CreateScopesAsync(new OpenIddictScopeDescriptor
        {
            Name = OpenIddictConstants.Scopes.OpenId,
            DisplayName = "OpenID Connect", // tên hiển thị thân thiện
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Xác thực danh tính",
                [CultureInfo.GetCultureInfo("en")] = "OpenID Connect"
            },
            Description = "Xác thực bằng giao thức OpenID Connect",
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Cho phép ứng dụng dùng thông tin danh tính của bạn để đăng nhập",
                [CultureInfo.GetCultureInfo("en")] = "Allow the application to authenticate you using OpenID Connect"
            }
        });

        // scope Profile - thông tin cơ bản của người dùng
        await CreateScopesAsync(new OpenIddictScopeDescriptor
        {
            Name = OpenIddictConstants.Scopes.Profile,
            DisplayName = "Hồ sơ cá nhân",
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Hồ sơ cá nhân",
                [CultureInfo.GetCultureInfo("en")] = "Profile"
            },
            Description = "Truy cập thông tin hồ sơ cá nhân cơ bản của bạn",
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Cho phép ứng dụng truy cập tên, ảnh đại diện và các thông tin cơ bản khác của bạn",
                [CultureInfo.GetCultureInfo("en")] = "Allow the application to access your basic profile information like name and picture"
            }
        });

        // Email scope
        await CreateScopesAsync(new OpenIddictScopeDescriptor
        {
            Name = OpenIddictConstants.Scopes.Email,
            DisplayName = "Email",
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Email",
                [CultureInfo.GetCultureInfo("en")] = "Email"
            },
            Description = "Truy cập địa chỉ email của bạn",
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Cho phép ứng dụng truy cập địa chỉ email của bạn",
                [CultureInfo.GetCultureInfo("en")] = "Allow the application to access your email address"
            }
        });

        // Phone scope
        await CreateScopesAsync(new OpenIddictScopeDescriptor
        {
            Name = OpenIddictConstants.Scopes.Phone,
            DisplayName = "Số điện thoại",
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Số điện thoại",
                [CultureInfo.GetCultureInfo("en")] = "Phone"
            },
            Description = "Truy cập số điện thoại của bạn",
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Cho phép ứng dụng truy cập số điện thoại của bạn",
                [CultureInfo.GetCultureInfo("en")] = "Allow the application to access your phone number"
            }
        });

        // Address scope
        await CreateScopesAsync(new OpenIddictScopeDescriptor
        {
            Name = OpenIddictConstants.Scopes.Address,
            DisplayName = "Thông tin địa chỉ",
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Thông tin địa chỉ",
                [CultureInfo.GetCultureInfo("en")] = "Address"
            },
            Description = "Truy cập thông tin địa chỉ của bạn",
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Cho phép ứng dụng truy cập thông tin địa chỉ của bạn",
                [CultureInfo.GetCultureInfo("en")] = "Allow the application to access your address information"
            }
        });

        // Roles scope
        await CreateScopesAsync(new OpenIddictScopeDescriptor
        {
            Name = OpenIddictConstants.Scopes.Roles,
            DisplayName = "Thông tin vai trò",
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Thông tin vai trò",
                [CultureInfo.GetCultureInfo("en")] = "Roles"
            },
            Description = "Truy cập thông tin vai trò của bạn",
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Cho phép ứng dụng truy cập vai trò và thông tin quyền của bạn",
                [CultureInfo.GetCultureInfo("en")] = "Allow the application to access your roles and permissions"
            }
        });

        // scope Offline Access - dùng để lấy refresh token
        await CreateScopesAsync(new OpenIddictScopeDescriptor
        {
            Name = OpenIddictConstants.Scopes.OfflineAccess,
            DisplayName = "Truy cập ngoại tuyến",
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Truy cập ngoại tuyến",
                [CultureInfo.GetCultureInfo("en")] = "Offline Access"
            },
            Description = "Truy cập thông tin của bạn khi bạn chưa đăng nhập",
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Cho phép ứng dụng truy cập thông tin của bạn khi bạn chưa đăng nhập",
                [CultureInfo.GetCultureInfo("en")] = "Allow the application to access your information while you are offline"
            }
        });
    }

    private async Task CreateApiScopeAsync(string scope, string apiResource)
    {
        await CreateScopesAsync(new OpenIddictScopeDescriptor
        {
            Name = scope,
            DisplayName = "Single Applications",
            DisplayNames =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Ứng dụng đơn khối",
                [CultureInfo.GetCultureInfo("en")] = "Single Applications"
            },
            Description = "Ủy quyền giao diện áp dụng cho ứng dụng đơn khối",
            Descriptions =
            {
                [CultureInfo.GetCultureInfo("zh-Hans")] = "Cho phép ứng dụng sử dụng giao diện của ứng dụng đơn khối",
                [CultureInfo.GetCultureInfo("en")] = "Allow applications to use the interface of monolithic applications"
            },
            Resources =
            {
                apiResource,
                "http://localhost:30000",
            }
        });
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
                OpenIddictConstants.GrantTypes.Implicit,
                OpenIddictConstants.GrantTypes.Password,
                OpenIddictConstants.GrantTypes.RefreshToken,
                // TODO: Tham chiếu dự án?
                "link_user"],
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
                OpenIddictConstants.ApplicationTypes.Native,
                internalServiceClientId,
                OpenIddictConstants.ClientTypes.Confidential,
                OpenIddictConstants.ConsentTypes.Explicit,
                "Abp Internal Service Client",
                configurationSection["InternalService:ClientSecret"] ?? "1q2w3e*",
                [OpenIddictConstants.GrantTypes.ClientCredentials],
                [OpenIddictConstants.ResponseTypes.Token, scope]);
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
                // TODO: Tham chiếu dự án?
                "link_user"],
                [OpenIddictConstants.Scopes.OpenId,
                OpenIddictConstants.Scopes.Email,
                OpenIddictConstants.Scopes.Roles,
                OpenIddictConstants.Scopes.Address,
                OpenIddictConstants.Scopes.Phone,
                OpenIddictConstants.Scopes.Profile,
                OpenIddictConstants.Scopes.OfflineAccess,
                 scope],
                oauthClientRedirectUrls,
                oauthClientPostLogoutRedirectUrls);

            var oauthClientPermissions = new string[1]
            {
                "AbpIdentity.UserLookup"
            };
            await PermissionDataSeeder.SeedAsync(ClientPermissionValueProvider.ProviderName, oauthClientId, oauthClientPermissions);
        }
    }
}
