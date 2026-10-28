using LINGYUN.Abp.IP.Location;
using LINGYUN.Abp.Tests;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.MaxMindGeoIP2;

[DependsOn(
    typeof(AbpMaxMindGeoIP2Module),
    typeof(AbpTestsBaseModule))]
public class AbpMaxMindGeoIP2TestModule : AbpModule
{
    private const string UserSecretsId = "4569336C-3EC4-4E55-A9B7-156A1D7E051E";

    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.ReplaceConfiguration(ConfigurationHelper.BuildConfiguration(builderAction: builder =>
        {
            builder.AddUserSecrets(UserSecretsId);
        }));
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpIPLocationResolveOptions>(options =>
        {
            // IP Trung Quốc không hiển thị quốc gia (loại khỏi ghi chú)
            options.RemoveCountry = new[] { "Trung Quốc" };
        });
    }
}
