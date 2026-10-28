using LINGYUN.Abp.PushPlus.Message;
using LINGYUN.Abp.Tests;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Notifications.PushPlus;

[DependsOn(
    typeof(AbpNotificationsPushPlusModule),
    typeof(AbpNotificationsTestsModule),
    typeof(AbpTestsBaseModule))]
public class AbpNotificationsPushPlusTestsModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Thay cách gửi thật bằng triển khai giả dạng thu thập, tránh gọi thật tới giao diện PushPlus
        context.Services.Replace(
            ServiceDescriptor.Singleton<IPushPlusMessageSender, FakePushPlusMessageSender>());
    }
}
