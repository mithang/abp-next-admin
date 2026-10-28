using LINGYUN.Abp.PushPlus;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Notifications.PushPlus;

[DependsOn(
    typeof(AbpNotificationsModule),
    typeof(AbpPushPlusModule))]
public class AbpNotificationsPushPlusModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpNotificationsPublishOptions>(options =>
        {
            options.PublishProviders.Add<PushPlusNotificationPublishProvider>();
        });

        // Khai báo các dạng payload mà kênh này hỗ trợ (kiểm tra hợp đồng tồn tại ngay tại thời điểm đăng ký)
        Configure<AbpNotificationChannelDataOptions>(options =>
        {
            options.Add<PushPlusChannelData>();
        });
    }
}
