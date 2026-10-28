using AlibabaCloud.SDK.Dysmsapi20170525;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Sms.Aliyun;

public interface IDysmsClientFactory
{
    /// <summary>
    /// Tạo client SMS
    /// </summary>
    /// <returns></returns>
    Task<Client> CreateAsync();
}
