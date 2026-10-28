using LINGYUN.Abp.WeChat.Work;
using LINGYUN.Abp.WeChat.Work.Localization;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Volo.Abp.Json.SystemTextJson;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

[DependsOn(
    typeof(AbpWeChatWorkModule),
    typeof(AbpNotificationsModule))]
public class AbpNotificationsWeChatWorkModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<AbpNotificationsWeChatWorkModule>();
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Get<WeChatWorkResource>()
                .AddVirtualJson("/LINGYUN/Abp/Notifications/WeChat/Work/Localization/Resources");
        });

        Configure<AbpNotificationsPublishOptions>(options =>
        {
            options.PublishProviders.Add<WeChatWorkNotificationPublishProvider>();
        });

        // Thẻ mẫu là kiểu trừu tượng: đăng ký bộ chuyển đổi kiểu để nó có thể chuyển đổi qua lại trong dữ liệu kênh (JSON)
        Configure<AbpSystemTextJsonSerializerOptions>(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new TemplateCardSystemTextJsonConverter());
        });

        // Khai báo các dạng tải trọng mà kênh này hỗ trợ (hợp đồng kiểm tra tính tồn tại ngay tại thời điểm đăng ký)
        Configure<AbpNotificationChannelDataOptions>(options =>
        {
            options.Add<WeChatWorkMiniProgramNoticeChannelData>();
            options.Add<WeChatWorkMpNewChannelData>();
            options.Add<WeChatWorkTemplateCardChannelData>();
            options.Add<WeChatWorkTextCardChannelData>();
            options.Add<WeChatWorkVideoChannelData>();
            options.Add<WeChatWorkVoiceChannelData>();
            options.Add<WeChatWorkFileChannelData>();
        });

        // Phân phối factory của vật chứa thông báo
        Configure<AbpWeChatWorkNotificationMessageOptions>(options =>
        {
            options.MapDefaultMessageFactories();
        });
    }
}
