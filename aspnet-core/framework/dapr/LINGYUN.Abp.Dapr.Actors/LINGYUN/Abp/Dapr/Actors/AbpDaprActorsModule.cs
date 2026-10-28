using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Http.Client;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Dapr.Actors;

[DependsOn(
    typeof(AbpHttpClientModule)
    )]
public class AbpDaprActorsModule : AbpModule
{
    /// <summary>
    /// Tích hợp với AbpHttpClient, tạo một HttpClient có tên
    /// </summary>
    internal const string DaprHttpClient = "_AbpDaprActorsClient";

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddHttpClient(DaprHttpClient);
    }
}
