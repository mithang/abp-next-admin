using LINGYUN.Abp.WeChat.Work.Token.Models;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Caching;
using Volo.Abp.Settings;

namespace LINGYUN.Abp.WeChat.Work.Token;
public abstract class WeChatWorkTokenProviderBase
{
    public ILogger<WeChatWorkTokenProviderBase> Logger { get; set; }

    protected abstract string ProviderName { get; }
    protected ISettingProvider SettingProvider { get; }
    protected IHttpClientFactory HttpClientFactory { get; }
    protected IDistributedCache<WeChatWorkTokenCacheItem> WeChatWorkTokenCache { get; }
    protected WeChatWorkTokenProviderBase(
        ISettingProvider settingProvider,
        IHttpClientFactory httpClientFactory,
        IDistributedCache<WeChatWorkTokenCacheItem> cache)
    {
        HttpClientFactory = httpClientFactory;
        SettingProvider = settingProvider;
        WeChatWorkTokenCache = cache;

        Logger = NullLogger<WeChatWorkTokenProviderBase>.Instance;
    }

    /// <summary>
    /// Lấy cấu hình Token trong bộ nhớ đệm
    /// </summary>
    /// <param name="corpId"></param>
    /// <param name="agentId"></param>
    /// <param name="secret"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    protected async virtual Task<WeChatWorkTokenCacheItem> InternalGetTokenAsync(
        string corpId,
        string agentId,
        string secret,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrEmpty(corpId, nameof(corpId));
        Check.NotNullOrEmpty(agentId, nameof(agentId));
        Check.NotNullOrEmpty(secret, nameof(secret));

        var cacheKey = WeChatWorkTokenCacheItem.CalculateCacheKey(ProviderName, corpId, agentId);

        return await GetCacheItemAsync(cacheKey, ProviderName, corpId, agentId, secret, cancellationToken);
    }
    /// <summary>
    /// Lấy hoặc làm mới cấu hình Token trong bộ nhớ đệm phân tán
    /// </summary>
    /// <param name="cacheKey"></param>
    /// <param name="provider"></param>
    /// <param name="corpId"></param>
    /// <param name="agentId"></param>
    /// <param name="secret"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    protected async virtual Task<WeChatWorkTokenCacheItem> GetCacheItemAsync(
        string cacheKey,
        string provider,
        string corpId,
        string agentId,
        string secret,
        CancellationToken cancellationToken = default)
    {
        var cacheItem = await WeChatWorkTokenCache.GetAsync(cacheKey, token: cancellationToken);

        if (cacheItem != null)
        {
            Logger.LogDebug($"Found WeChatWorkToken in the cache: {cacheKey}");
            return cacheItem;
        }

        Logger.LogDebug($"Not found WeChatWorkToken in the cache, getting from the httpClient: {cacheKey}");

        var client = HttpClientFactory.CreateWeChatWorkApiClient();

        var request = new WeChatWorkTokenRequest(corpId, secret);

        var tokenResponse = await client.GetTokenAsync(request, cancellationToken);
        var token = tokenResponse.ToWeChatWorkToken();
        cacheItem = new WeChatWorkTokenCacheItem(corpId, agentId, token);

        Logger.LogDebug($"Setting the cache item: {cacheKey}");

        var cacheOptions = new DistributedCacheEntryOptions
        {
            // Đặt thời gian hết hạn tuyệt đối bằng hai phút còn lại của thời hạn hiệu lực Token
            AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(token.ExpiresIn - 100),
        };

        await WeChatWorkTokenCache.SetAsync(cacheKey, cacheItem, cacheOptions, token: cancellationToken);

        Logger.LogDebug($"Finished setting the cache item: {cacheKey}");

        return cacheItem;
    }
}
