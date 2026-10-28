using LINGYUN.Abp.Dapr.Client.DynamicProxying;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Http;

namespace LINGYUN.Abp.Dapr.Client.ClientProxying;

public class AbpDaprClientProxyOptions
{
    public Dictionary<Type, DynamicDaprClientProxyConfig> DaprClientProxies { get; set; }
    /// <summary>
    /// Thêm một thông điệp yêu cầu có thể cấu hình
    /// Tham số một:    appId
    /// Tham số hai:    HttpRequestMessage
    /// </summary>
    public List<Action<string, HttpRequestMessage>> ProxyRequestActions { get; }
    /// <summary>
    /// Xử lý phản hồi, trả về nội dung phản hồi
    /// </summary>
    public Func<HttpResponseMessage, IAbpLazyServiceProvider, Task<string?>>? ProxyResponseContent { get; private set; }
    /// <summary>
    /// Định dạng lỗi
    /// </summary>
    public Func<HttpResponseMessage, IAbpLazyServiceProvider, Task<RemoteServiceErrorInfo?>>? ProxyErrorFormat { get; private set; }
    public AbpDaprClientProxyOptions()
    {
        DaprClientProxies = new Dictionary<Type, DynamicDaprClientProxyConfig>();
        ProxyRequestActions = new List<Action<string, HttpRequestMessage>>();

        OnResponse(async (response, serviceProvider) =>
        {
            return await response.Content.ReadAsStringAsync();
        });
    }
    /// <summary>
    /// Xử lý dữ liệu phản hồi của lệnh gọi giữa các dịch vụ
    /// </summary>
    /// <param name="func"></param>
    public void OnResponse(Func<HttpResponseMessage, IAbpLazyServiceProvider, Task<string?>> func)
    {
        ProxyResponseContent = func;
    }
    /// <summary>
    /// Xử lý thông điệp lỗi của lệnh gọi giữa các dịch vụ
    /// </summary>
    /// <param name="func"></param>
    public void OnError(Func<HttpResponseMessage, IAbpLazyServiceProvider, Task<RemoteServiceErrorInfo?>> func)
    {
        ProxyErrorFormat = func;
    }
}
