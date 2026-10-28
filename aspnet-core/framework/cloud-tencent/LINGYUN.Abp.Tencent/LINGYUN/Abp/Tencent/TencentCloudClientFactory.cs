using Microsoft.Extensions.Caching.Memory;
using System.Linq;
using TencentCloud.Common;
using TencentCloud.Common.Profile;
using Volo.Abp;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;

namespace LINGYUN.Abp.Tencent;

public class TencentCloudClientFactory<TClient> : AbstractTencentCloudClientFactory<TClient>
{
    public TencentCloudClientFactory(
        IMemoryCache clientCache, 
        ISettingProvider settingProvider) 
        : base(clientCache, settingProvider)
    {
    }

    protected override TClient CreateClient(TencentCloudClientCacheItem cloudCache)
    {
        var clientCtr = typeof(TClient)
            .GetConstructors()
            .Where(x => x.GetParameters().Length == 3)
            .FirstOrDefault();
        if (clientCtr != null)
        {
            var cred = new Credential
            {
                SecretId = cloudCache.SecretId,
                SecretKey = cloudCache.SecretKey,
            };

            var httpProfile = new HttpProfile
            {
                ReqMethod = cloudCache.HttpMethod ?? "POST",
                Timeout = cloudCache.Timeout,
                // Các api khác nhau cần khu vực khác nhau, một số
                Endpoint = cloudCache.ApiEndPoint,
                WebProxy = cloudCache.WebProxy,
            };
            var clientProfile = new ClientProfile
            {
                HttpProfile = httpProfile,
            };

            // Tạo thực thể client thông qua reflection
            // TODO: Nếu ảnh hưởng đến hiệu năng thì cần điều chỉnh sang tạo thực thể thủ công thông qua Options
            return (TClient)clientCtr.Invoke(new object?[] { cred, cloudCache.EndPoint, clientProfile });
        }

        throw new AbpException($"Failed to specify initialization Type for client {typeof(TClient).FullName}. Client instance could not be created");
    }
}
