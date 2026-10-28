using LINGYUN.Abp.WeChat.Work;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Json.SystemTextJson;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Notifications.Webhook.WeChat.Work;

[DependsOn(
    typeof(AbpNotificationsWebhookModule),
    typeof(AbpWeChatWorkModule))]
public class AbpNotificationsWebhookWeChatWorkModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Cho phép bên sử dụng ghi đè trong PreConfigure (ví dụ: tắt markdown v2)
        var preActions = context.Services.GetPreConfigureActions<AbpNotificationsWebhookWeChatWorkOptions>();

        Configure<AbpNotificationsWebhookWeChatWorkOptions>(options =>
        {
            options.UseMarkdownV2 = true;

            preActions.Configure(options);
        });

        Configure<AbpNotificationsWebhookOptions>(options =>
        {
            options.Contributors.Add(new WeChatWorkWebhookNotificationContributor());
        });

        // Thẻ mẫu là kiểu trừu tượng: đăng ký bộ chuyển đổi kiểu để nó có thể đi-về trong dữ liệu kênh (JSON)
        Configure<AbpSystemTextJsonSerializerOptions>(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new WebhookTemplateCardSystemTextJsonConverter());
        });

        // Khai báo các dạng tải trọng mà kênh này hỗ trợ (hợp đồng kiểm tra sự tồn tại ngay tại thời điểm đăng ký)
        Configure<AbpNotificationChannelDataOptions>(options =>
        {
            options.Add<WeChatWorkWebhookTextChannelData>();
            options.Add<WeChatWorkWebhookMarkdownChannelData>();
            options.Add<WeChatWorkWebhookMarkdownV2ChannelData>();
            options.Add<WeChatWorkWebhookImageChannelData>();
            options.Add<WeChatWorkWebhookNewsChannelData>();
            options.Add<WeChatWorkWebhookFileChannelData>();
            options.Add<WeChatWorkWebhookVoiceChannelData>();
            options.Add<WeChatWorkWebhookTemplateCardChannelData>();
        });

        // Phân phối qua factory vật mang tin nhắn
        Configure<AbpNotificationsWebhookWeChatWorkMessageOptions>(options =>
        {
            options.MapDefaultMessageFactories();
        });
    }
}
