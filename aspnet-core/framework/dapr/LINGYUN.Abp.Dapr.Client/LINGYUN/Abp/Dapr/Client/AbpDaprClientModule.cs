using LINGYUN.Abp.Dapr.Client.DynamicProxying;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Http.Client;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Dapr.Client;

[DependsOn(
    typeof(AbpHttpClientModule)
    )]
public class AbpDaprClientModule : AbpModule
{
    /// <summary>
    /// Tích hợp với AbpHttpClient, tạo một HttpClient có tên
    /// </summary>
    internal const string DaprHttpClient = "_AbpDaprProxyClient";

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddHttpClient(DaprHttpClient);

        context.Services.AddTransient(typeof(DynamicDaprProxyInterceptorClientProxy<>));
    }
}
