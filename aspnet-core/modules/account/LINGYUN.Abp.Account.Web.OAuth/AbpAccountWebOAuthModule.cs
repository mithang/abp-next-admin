using AspNet.Security.OAuth.Bilibili;
using AspNet.Security.OAuth.GitHub;
using AspNet.Security.OAuth.QQ;
using AspNet.Security.OAuth.Weixin;
using AspNet.Security.OAuth.WorkWeixin;
using LINGYUN.Abp.Account.OAuth;
using LINGYUN.Abp.Account.OAuth.Localization;
using LINGYUN.Abp.Account.OAuth.Settings;
using LINGYUN.Abp.Tencent.QQ.Settings;
using LINGYUN.Abp.WeChat.Official.Settings;
using LINGYUN.Abp.WeChat.Work.Settings;
using Microsoft.Extensions.Configuration;
using LINGYUN.Abp.Account.Web.OAuth.ExternalProviders.Bilibili;
using LINGYUN.Abp.Account.Web.OAuth.ExternalProviders.GitHub;
using LINGYUN.Abp.Account.Web.OAuth.ExternalProviders.QQ;
using LINGYUN.Abp.Account.Web.OAuth.ExternalProviders.WeChat;
using LINGYUN.Abp.Account.Web.OAuth.ExternalProviders.WeCom;
using LINGYUN.Abp.Account.Web.OAuth.Microsoft.Extensions.DependencyInjection;
using LINGYUN.Abp.Tencent.QQ;
using LINGYUN.Abp.WeChat.Official;
using LINGYUN.Abp.WeChat.Work;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Account.Localization;
using Volo.Abp.AspNetCore.Mvc.Localization;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.Account.Web.OAuth;

[DependsOn(typeof(AbpAccountWebModule))]
[DependsOn(typeof(AbpAccountOAuthModule))]
[DependsOn(typeof(AbpTencentQQModule))]
[DependsOn(typeof(AbpWeChatOfficialModule))]
[DependsOn(typeof(AbpWeChatWorkModule))]
public class AbpAccountWebOAuthModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
        {
            options.AddAssemblyResource(typeof(AccountResource), typeof(AbpAccountWebOAuthModule).Assembly);
        });

        PreConfigure<IMvcBuilder>(mvcBuilder =>
        {
            mvcBuilder.AddApplicationPartIfNotExists(typeof(AbpAccountWebOAuthModule).Assembly);
        });
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<AbpAccountWebOAuthModule>("LINGYUN.Abp.Account.Web.OAuth");
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Get<AccountResource>()
                .AddBaseTypes(typeof(AccountOAuthResource));
        });

        // SEC-06: chỉ đăng ký scheme khi provider đã được cấu hình thật qua setting.
        // Trước đây cả 5 scheme luôn được đăng ký với ClientId/ClientSecret dummy
        // ("ClientId"/"ClientSecret"), khiến nút đăng nhập ngoài hiển thị nhưng bấm
        // vào chỉ nhận lỗi từ provider thật. Giá trị dummy và giá trị rỗng đều coi
        // là chưa cấu hình. LƯU Ý thay đổi hành vi: quyết định đăng ký đọc từ
        // ConfigurationSettingValueProvider (appsettings key "Settings:<tên setting>"
        // hoặc biến môi trường "Settings__<tên setting>") tại thời điểm khởi động;
        // giá trị chỉ lưu trong DB (Global/Tenant setting) sẽ KHÔNG đăng ký scheme
        // nữa — muốn bật provider thì cấu hình qua appsettings/biến môi trường rồi
        // khởi động lại. TUYỆT ĐỐI không đổi default về chuỗi rỗng: vòng security 2
        // đã chứng minh chuỗi rỗng làm mọi request 500 (options validation toàn cục).
        var configuration = context.Services.GetConfiguration();
        var authenticationBuilder = context.Services.AddAuthentication();

        if (IsProviderConfigured(configuration, AccountOAuthSettingNames.GitHub.ClientId, AccountOAuthSettingNames.GitHub.ClientSecret))
        {
            authenticationBuilder
                .AddGitHub(options =>
                {
                    options.ClientId = "ClientId";
                    options.ClientSecret = "ClientSecret";

                    options.Scope.Add("user:email");
                }).UseSettingProvider<
                    GitHubAuthenticationOptions,
                    GitHubAuthenticationHandler,
                    GitHubAuthHandlerOptionsProvider>();
        }

        if (IsProviderConfigured(configuration, TencentQQSettingNames.QQConnect.AppId, TencentQQSettingNames.QQConnect.AppKey))
        {
            authenticationBuilder
                .AddQQ(options =>
                {
                    options.ClientId = "ClientId";
                    options.ClientSecret = "ClientSecret";
                }).UseSettingProvider<
                    QQAuthenticationOptions,
                    QQAuthenticationHandler,
                    QQAuthHandlerOptionsProvider>();
        }

        if (IsProviderConfigured(configuration, WeChatOfficialSettingNames.AppId, WeChatOfficialSettingNames.AppSecret))
        {
            authenticationBuilder
                .AddWeixin(options =>
                {
                    options.ClientId = "ClientId";
                    options.ClientSecret = "ClientSecret";
                }).UseSettingProvider<
                    WeixinAuthenticationOptions,
                    WeixinAuthenticationHandler,
                    WeChatAuthHandlerOptionsProvider>();
        }

        if (IsProviderConfigured(configuration, WeChatWorkSettingNames.Connection.CorpId, WeChatWorkSettingNames.Connection.Secret))
        {
            authenticationBuilder
                .AddWorkWeixin(options =>
                {
                    options.ClientId = "ClientId";
                    options.ClientSecret = "ClientSecret";
                }).UseSettingProvider<
                    WorkWeixinAuthenticationOptions,
                    WorkWeixinAuthenticationHandler,
                    WeComAuthHandlerOptionsProvider>();
        }

        if (IsProviderConfigured(configuration, AccountOAuthSettingNames.Bilibili.ClientId, AccountOAuthSettingNames.Bilibili.ClientSecret))
        {
            authenticationBuilder
                .AddBilibili(options =>
                {
                    options.ClientId = "ClientId";
                    options.ClientSecret = "ClientSecret";
                }).UseSettingProvider<
                    BilibiliAuthenticationOptions,
                    BilibiliAuthenticationHandler,
                    BilibiliAuthHandlerOptionsProvider>();
        }
    }

    private static bool IsProviderConfigured(IConfiguration configuration, string clientIdSettingName, string clientSecretSettingName)
    {
        // ABP ConfigurationSettingValueProvider đọc setting từ key "Settings:<tên setting>".
        var clientId = configuration[$"Settings:{clientIdSettingName}"];
        var clientSecret = configuration[$"Settings:{clientSecretSettingName}"];

        return !string.IsNullOrWhiteSpace(clientId) && clientId != "ClientId"
            && !string.IsNullOrWhiteSpace(clientSecret) && clientSecret != "ClientSecret";
    }
}
