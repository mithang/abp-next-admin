using AlibabaCloud.SDK.Dypnsapi20170525;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Sms.Aliyun;

public interface IDypnsClientFactory
{
    /// <summary>
    /// Tạo client xác thực SMS
    /// </summary>
    /// <returns></returns>
    Task<Client> CreateAsync();
}
