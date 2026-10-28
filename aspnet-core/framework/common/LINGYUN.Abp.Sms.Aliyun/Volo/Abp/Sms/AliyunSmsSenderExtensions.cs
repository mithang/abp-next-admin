using LINGYUN.Abp.Sms.Aliyun;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Volo.Abp.Sms;

public static class AliyunSmsSenderExtensions
{
    /// <summary>
    /// Giao diện SMS mở rộng
    /// </summary>
    /// <param name="smsSender"></param>
    /// <param name="templateCode">Mã mẫu SMS</param>
    /// <param name="phoneNumber">Số điện thoại di động nhận tin</param>
    /// <param name="templateParams">Tham số mẫu SMS</param>
    /// <returns></returns>
    public static async Task SendAsync(this ISmsSender smsSender, string templateCode, string phoneNumber, IDictionary<string, object>? templateParams = null)
    {
        var smsMessage = new SmsMessage(phoneNumber, nameof(AliyunSmsSender));
        smsMessage.Properties.Add("TemplateCode", templateCode);
        if(templateParams != null)
        {
            smsMessage.Properties.AddIfNotContains(templateParams);
        }
        await smsSender.SendAsync(smsMessage);
    }

    /// <summary>
    /// Giao diện SMS mở rộng
    /// </summary>
    /// <param name="smsSender"></param>
    /// <param name="signName">Chữ ký SMS</param>
    /// <param name="templateCode">Mã mẫu SMS</param>
    /// <param name="phoneNumber">Số điện thoại di động nhận tin</param>
    /// <param name="templateParams">Tham số mẫu SMS</param>
    /// <returns></returns>
    public static async Task SendAsync(this ISmsSender smsSender, string signName, string templateCode, string phoneNumber, IDictionary<string, object>? templateParams = null)
    {
        var smsMessage = new SmsMessage(phoneNumber, nameof(AliyunSmsSender));
        smsMessage.Properties.Add("SignName", signName);
        smsMessage.Properties.Add("TemplateCode", templateCode);
        if (templateParams != null)
        {
            smsMessage.Properties.AddIfNotContains(templateParams);
        }
        await smsSender.SendAsync(smsMessage);
    }
}
