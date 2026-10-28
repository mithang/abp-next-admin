using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Account.Localization;
using Volo.Abp.AspNetCore.Mvc.Localization;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Account;

[DependsOn(
    typeof(AbpAccountApplicationContractsModule),
    typeof(Volo.Abp.Account.AbpAccountHttpApiModule))]
public class AbpAccountHttpApiModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
        {
            options.AddAssemblyResource(typeof(AccountResource), typeof(AbpAccountApplicationContractsModule).Assembly);
            // Vốn được chỉ định trong dự án Web, cần thiết khi không tham chiếu dự án Web
            options.AddAssemblyResource(typeof(AccountResource), typeof(Volo.Abp.Account.AbpAccountApplicationContractsModule).Assembly);
        });

        PreConfigure<IMvcBuilder>(mvcBuilder =>
        {
            mvcBuilder.AddApplicationPartIfNotExists(typeof(AbpAccountHttpApiModule).Assembly);
        });
    }
}
