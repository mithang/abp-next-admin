using AlibabaCloud.SDK.Captcha20230305;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Aliyun.Captcha;

public interface ICaptchaClientFactory
{
    /// <summary>
    /// Xây dựng client mã xác thực
    /// </summary>
    /// <returns></returns>
    Task<Client> CreateAsync();
}
