using Dapr.Actors;
using Dapr.Actors.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.DynamicProxy;
using Volo.Abp.Http;
using Volo.Abp.Http.Client;
using Volo.Abp.Http.Client.Authentication;
using Volo.Abp.Http.Client.Proxying;
using Volo.Abp.Json.SystemTextJson;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Threading;

namespace LINGYUN.Abp.Dapr.Actors.DynamicProxying;

public class DynamicDaprActorProxyInterceptor<TService> : AbpInterceptor, ITransientDependency
     where TService: IActor
{
    protected ICurrentTenant CurrentTenant { get; }
    protected AbpSystemTextJsonSerializerOptions JsonSerializerOptions { get; }
    protected AbpDaprActorProxyOptions DaprActorProxyOptions { get; }
    protected IProxyHttpClientFactory HttpClientFactory { get; }
    protected IRemoteServiceHttpClientAuthenticator ClientAuthenticator { get; }
    protected IRemoteServiceConfigurationProvider RemoteServiceConfigurationProvider { get; }
    public ILogger<DynamicDaprActorProxyInterceptor<TService>> Logger { get; set; }

    public DynamicDaprActorProxyInterceptor(
        IOptions<AbpDaprActorProxyOptions> daprActorProxyOptions,
        IOptions<AbpSystemTextJsonSerializerOptions> jsonSerializerOptions,
        IProxyHttpClientFactory httpClientFactory,
        IRemoteServiceHttpClientAuthenticator clientAuthenticator,
        IRemoteServiceConfigurationProvider remoteServiceConfigurationProvider,
        ICurrentTenant currentTenant)
    {
        CurrentTenant = currentTenant;
        HttpClientFactory = httpClientFactory;
        ClientAuthenticator = clientAuthenticator;
        DaprActorProxyOptions = daprActorProxyOptions.Value;
        JsonSerializerOptions = jsonSerializerOptions.Value;
        RemoteServiceConfigurationProvider = remoteServiceConfigurationProvider;

        Logger = NullLogger<DynamicDaprActorProxyInterceptor<TService>>.Instance;
    }

    public override async Task InterceptAsync(IAbpMethodInvocation invocation)
    {
        var isAsyncMethod = invocation.Method.IsAsync();
        if (!isAsyncMethod)
        {
            // see: https://docs.dapr.io/developing-applications/sdks/dotnet/dotnet-actors/dotnet-actors-howto/
            // Tài liệu Dapr Actor: Kiểu trả về của phương thức Actor phải là Task hoặc Task<object>
            throw new AbpException("The return type of Actor method must be Task or Task<object>");
        }
        if (invocation.Arguments.Length > 1)
        {
            // see: https://docs.dapr.io/developing-applications/sdks/dotnet/dotnet-actors/dotnet-actors-howto/
            // Tài liệu Dapr Actor: Phương thức Actor tối đa chỉ có một tham số
            throw new AbpException("Actor method can have one argument at a maximum");
        }
        await MakeRequestAsync(invocation);
    }

    private async Task MakeRequestAsync(IAbpMethodInvocation invocation)
    {
        // Lấy cấu hình Actor
        var actorProxyConfig = DaprActorProxyOptions.ActorProxies.GetOrDefault(typeof(TService)) ?? throw new AbpException($"Could not get DynamicDaprActorProxyConfig for {typeof(TService).FullName}.");
        var remoteServiceConfig = await RemoteServiceConfigurationProvider.GetConfigurationOrDefaultAsync(actorProxyConfig.RemoteServiceName);

        // Có quá nhiều định nghĩa Actors, có thể cân nhắc dùng BaseUrl mặc định làm địa chỉ từ xa
        if (remoteServiceConfig.BaseUrl.IsNullOrWhiteSpace())
        {
            throw new AbpException($"Could not get BaseUrl for {actorProxyConfig.RemoteServiceName} Or Default.");
        }

        var actorProxyOptions = new ActorProxyOptions
        {
            HttpEndpoint = remoteServiceConfig.BaseUrl,
            RequestTimeout = TimeSpan.FromMilliseconds(remoteServiceConfig.GetRequestTimeOut()),
            DaprApiToken = remoteServiceConfig.GetApiToken(),
            JsonSerializerOptions = JsonSerializerOptions.JsonSerializerOptions,
        };

        // Bộ xử lý yêu cầu tùy chỉnh
        // Thêm tiêu đề yêu cầu để truyền trạng thái
        // TODO: Actor mỗi lần chỉ xử lý được một yêu cầu, tính khả thi của việc dùng quản lý trạng thái để truyền trạng thái?
        var httpClientHandler = new DaprHttpClientHandler();

        AddHeaders(httpClientHandler);

        httpClientHandler.PreConfigure(async (requestMessage) =>
        {
            // Giữ chỗ
            var httpClient = HttpClientFactory.Create(AbpDaprActorsModule.DaprHttpClient);

            await ClientAuthenticator.Authenticate(
                new RemoteServiceHttpClientAuthenticateContext(
                    httpClient,
                    requestMessage,
                    remoteServiceConfig,
                    actorProxyConfig.RemoteServiceName));
            // Tiêu đề
            if (requestMessage.Headers.Authorization == null &&
                httpClient.DefaultRequestHeaders.Authorization != null)
            {
                requestMessage.Headers.Authorization = httpClient.DefaultRequestHeaders.Authorization;
            }
        });

        // Factory proxy
        var proxyFactory = new ActorProxyFactory(actorProxyOptions, (HttpMessageHandler)httpClientHandler);

        await MakeRequestAsync(invocation, proxyFactory);
    }

    private async Task MakeRequestAsync(
        IAbpMethodInvocation invocation,
        ActorProxyFactory proxyFactory
        )
    {
        var invokeType = typeof(TService);

        // RemoteServiceAttribute theo quy ước là tên Actor
        var remoteServiceAttr = invokeType.GetTypeInfo().GetCustomAttribute<RemoteServiceAttribute>();
        var actorType = remoteServiceAttr != null
            ? remoteServiceAttr.Name
            : invokeType.Name;

        var actorId = new ActorId(invokeType.FullName);

        try
        {
            // Tạo proxy kiểu mạnh
            var actorProxy = proxyFactory.CreateActorProxy<TService>(actorId, actorType);
            // Gọi từ xa
            var task = (Task)invocation.Method.Invoke(actorProxy, invocation.Arguments)!;
            await task;

            // Có giá trị trả về
            if (!invocation.Method.ReturnType.GenericTypeArguments.IsNullOrEmpty())
            {
                // Xử lý giá trị trả về
                invocation.ReturnValue = typeof(Task<>)
                    .MakeGenericType(invocation.Method.ReturnType.GenericTypeArguments[0])
                    .GetProperty(nameof(Task<object>.Result), BindingFlags.Public | BindingFlags.Instance)!
                    .GetValue(task)!;
            }
        }
        catch (ActorMethodInvocationException amie) // Các ngoại lệ khác bỏ qua, giao cho framework xử lý
        {
            if (amie.InnerException != null && amie.InnerException is ActorInvokeException aie)
            {
                // Dapr đã bọc ngoại lệ của dịch vụ từ xa
                throw new AbpDaprActorCallException(
                    new RemoteServiceErrorInfo
                    {
                        Message = aie.Message,
                        Code = aie.ActualExceptionType
                    }
                );
            }
            throw;
        }
    }

    private void AddHeaders(DaprHttpClientHandler handler)
    {
        //TenantId
        if (CurrentTenant.Id.HasValue)
        {
            //TODO: Use AbpAspNetCoreMultiTenancyOptions to get the key
            handler.AddHeader(TenantResolverConsts.DefaultTenantKey, CurrentTenant.Id.Value.ToString());
        }
        //Culture
        //TODO: Is that the way we want? Couldn't send the culture (not ui culture)
        var currentCulture = CultureInfo.CurrentUICulture.Name ?? CultureInfo.CurrentCulture.Name;
        if (!currentCulture.IsNullOrEmpty())
        {
            handler.AcceptLanguage(currentCulture);
        }
    }
}
