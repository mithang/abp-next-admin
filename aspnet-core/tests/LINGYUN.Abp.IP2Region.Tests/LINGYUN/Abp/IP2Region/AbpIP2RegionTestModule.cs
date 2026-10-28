using LINGYUN.Abp.IP.Location;
using LINGYUN.Abp.Tests;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.IP2Region;

[DependsOn(
    typeof(AbpIP2RegionModule),
    typeof(AbpTestsBaseModule))]
public class AbpIP2RegionTestModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpIPLocationResolveOptions>(options =>
        {
            // IP Trung Quốc không hiển thị quốc gia (loại khỏi ghi chú)
            options.RemoveCountry = new[] { "Trung Quốc" };
        });
    }
}