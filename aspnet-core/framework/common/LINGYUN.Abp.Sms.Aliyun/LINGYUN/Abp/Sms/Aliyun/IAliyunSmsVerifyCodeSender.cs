using System.Threading.Tasks;

namespace LINGYUN.Abp.Sms.Aliyun;
/// <summary>
/// Giao diện gửi mã xác minh SMS của Alibaba Cloud
/// </summary>
public interface IAliyunSmsVerifyCodeSender
{
    /// <summary>
    /// Gửi mã xác minh SMS
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task SendAsync(SmsVerifyCodeMessage message);
}
