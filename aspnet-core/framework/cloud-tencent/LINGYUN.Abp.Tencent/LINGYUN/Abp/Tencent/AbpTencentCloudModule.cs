using LINGYUN.Abp.Tencent.Localization;
using Volo.Abp.Caching;
using Volo.Abp.Json;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Features;
using Volo.Abp.Settings;

namespace LINGYUN.Abp.Tencent;

[DependsOn(
    typeof(AbpCachingModule),
    typeof(AbpFeaturesModule),
    typeof(AbpSettingsModule),
    typeof(AbpJsonModule),
    typeof(AbpLocalizationModule))]
public class AbpTencentCloudModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<AbpTencentCloudModule>();
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Add<TencentCloudResource>()
                .AddVirtualJson("/LINGYUN/Abp/Tencent/Localization/Resources");
        });

        context.Services.AddTransient(typeof(TencentCloudClientFactory<>));
        //Configure<AbpTencentCloudOptions>(options =>
        //{
        //    Theo SDK Tencent, mọi client đều gồm ba tham số, tạm thời thiết kế tạo client qua constructor bằng reflection
        //    options.ClientProxies.Add(typeof(AaClient), (cred, endpoint, profile) => new AaClient(cred, endpoint, profile));
        //    options.ClientProxies.Add(typeof(AaiClient), (cred, endpoint, profile) => new AaiClient(cred, endpoint, profile));
        //    options.ClientProxies.Add(typeof(AdvisorClient), (cred, endpoint, profile) => new AdvisorClient(cred, endpoint, profile));
        //});
    }
}
