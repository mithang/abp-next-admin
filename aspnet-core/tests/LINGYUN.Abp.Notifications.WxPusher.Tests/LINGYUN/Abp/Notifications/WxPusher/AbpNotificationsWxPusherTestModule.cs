using LINGYUN.Abp.WxPusher.Messages;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Notifications.WxPusher;

[DependsOn(
    typeof(AbpNotificationsWxPusherModule),
    typeof(AbpNotificationsTestsModule))]
public class AbpNotificationsWxPusherTestModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Thay cách gửi thật bằng triển khai giả dạng thu thập, tránh gọi thật tới giao diện WxPusher
        context.Services.Replace(
            ServiceDescriptor.Singleton<IWxPusherMessageSender, FakeWxPusherMessageSender>());
    }
}
