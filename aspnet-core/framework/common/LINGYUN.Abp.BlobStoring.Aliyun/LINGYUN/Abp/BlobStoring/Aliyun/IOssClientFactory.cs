using AlibabaCloud.OSS.V2;
using System.Threading.Tasks;

namespace LINGYUN.Abp.BlobStoring.Aliyun;

public interface IOssClientFactory
{
    /// <summary>
    /// Xây dựng Oss client
    /// </summary>
    /// <returns></returns>
    Task<Client> CreateAsync();
    /// <summary>
    /// Xây dựng Oss client
    /// </summary>
    /// <param name="configuration"></param>
    /// <returns></returns>
    Task<Client> CreateAsync(AliyunBlobProviderConfiguration configuration);
}
