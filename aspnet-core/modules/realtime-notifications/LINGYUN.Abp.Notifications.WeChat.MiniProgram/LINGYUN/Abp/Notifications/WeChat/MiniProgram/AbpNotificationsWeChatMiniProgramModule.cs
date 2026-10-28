using LINGYUN.Abp.WeChat.MiniProgram;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Notifications.WeChat.MiniProgram;

[DependsOn(
    typeof(AbpWeChatMiniProgramModule), 
    typeof(AbpNotificationsModule))]
public class AbpNotificationsWeChatMiniProgramModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var preActions = context.Services.GetPreConfigureActions<AbpNotificationsWeChatMiniProgramOptions>();

        Configure<AbpNotificationsWeChatMiniProgramOptions>(options =>
        {
            preActions.Configure(options);
        });

        Configure<AbpNotificationsPublishOptions>(options =>
        {
            options.PublishProviders.Add<WeChatMiniProgramNotificationPublishProvider>();
        });

        // Khai báo các dạng payload mà kênh này hỗ trợ (kiểm tra hợp đồng tồn tại ngay tại thời điểm đăng ký)
        Configure<AbpNotificationChannelDataOptions>(options =>
        {
            options.Add<WeChatMiniProgramSubscribeChannelData>();
        });
    }
}
