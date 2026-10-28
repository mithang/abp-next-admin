using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Sms;

namespace LINGYUN.Abp.Notifications.Sms;

/// <summary>
/// Trình triển khai mặc định của thông báo SMS
/// </summary>
public class SmsNotificationSender : ISmsNotificationSender, ITransientDependency
{
    public ILogger Logger { protected get; set; }
    protected ISmsSender SmsSender { get; }

    public SmsNotificationSender(ISmsSender smsSender)
    {
        SmsSender = smsSender;

        Logger = NullLogger<SmsNotificationSender>.Instance;
    }

    /// <summary>
    /// Gửi thông báo
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="phoneNumbers"></param>
    /// <returns></returns>
    public async virtual Task SendAsync(NotificationInfo notification, string phoneNumbers)
    {
        var templateCode = notification.Data.TryGetData("TemplateCode");
        if (templateCode == null)
        {
            Logger.LogWarning("sms template code is empty, can not send sms message!");
            return;
        }
        var message = new SmsMessage(phoneNumbers, "SmsNotification");

        // TODO: Tăng cường chức năng về sau, bổ sung mẫu SMS, chức năng mẫu thông báo
        message.Properties.Add("TemplateCode", templateCode);
        message.Properties.Add("SignName", notification.Data.TryGetData("SignName")!);
        foreach (var prop in notification.Data.ExtraProperties)
        {
            if (prop.Value != null)
            {
                message.Properties[prop.Key] = prop.Value;
            }
        }

        await SmsSender.SendAsync(message);
    }
}
