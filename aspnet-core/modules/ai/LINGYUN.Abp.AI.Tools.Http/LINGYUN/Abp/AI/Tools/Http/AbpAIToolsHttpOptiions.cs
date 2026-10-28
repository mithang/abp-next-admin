using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace LINGYUN.Abp.AI.Tools.Http;
public class AbpAIToolsHttpOptiions
{
    public List<Action<IHttpClientBuilder>> ClientBuildActions { get; }

    public List<Action<IServiceProvider, HttpClient>> ClientActions { get; }

    public List<Action<IServiceProvider, HttpClientHandler>> ClientHandlerActions { get; }
    /// <summary>
    /// Xử lý phản hồi yêu cầu Http tuỳ chỉnh
    /// </summary>
    /// <remarks>
    /// Tham số 1: Tên công cụ HttpAITool
    /// Tham số 2: IServiceProvider
    /// Tham số 3: Phản hồi yêu cầu
    /// </remarks>
    public IDictionary<string, Func<IServiceProvider, HttpResponseMessage, Task<object>>> HttpResponseActions { get; }
    public AbpAIToolsHttpOptiions()
    {
        ClientBuildActions = new List<Action<IHttpClientBuilder>>();
        ClientActions = new List<Action<IServiceProvider, HttpClient>>();
        ClientHandlerActions = new List<Action<IServiceProvider, HttpClientHandler>>();
        HttpResponseActions = new Dictionary<string, Func<IServiceProvider, HttpResponseMessage, Task<object>>>();
    }
}
