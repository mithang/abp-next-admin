using System;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.Validation.Localization;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.AspNetCore.Mvc.Validation
{
    [Obsolete("Dùng để kiểm thử các lớp liên quan đến model binding và validation, không cần tham chiếu")]
    [DependsOn(
        typeof(AbpAspNetCoreMvcModule))]
    public class AbpAspNetCoreMvcValidationModule : AbpModule
    {

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.AddEmbedded<AbpAspNetCoreMvcValidationModule>();
            });

            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                       .Get<AbpValidationResource>()
                       .AddVirtualJson("/LINGYUN/Abp/AspNetCore/Mvc/Validation/Localization/MissingFields");
            });
        }
    }
}
