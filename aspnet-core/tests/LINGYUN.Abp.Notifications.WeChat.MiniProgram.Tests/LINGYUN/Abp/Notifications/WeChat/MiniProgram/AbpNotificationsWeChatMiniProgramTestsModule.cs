using LINGYUN.Abp.Tests;
using LINGYUN.Abp.WeChat.MiniProgram.Messages;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.Notifications.WeChat.MiniProgram
{
    [DependsOn(
        typeof(AbpNotificationsWeChatMiniProgramModule),
        typeof(AbpNotificationsTestsModule),
        typeof(AbpTestsBaseModule))]
    public class AbpNotificationsWeChatMiniProgramTestsModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            PreConfigure<AbpNotificationsWeChatMiniProgramOptions>(options =>
            {
                // Giá trị mặc định, thuận tiện cho việc khẳng định "giá trị dự phòng khi chưa ghi dữ liệu kênh"
                options.DefaultTemplateId = "DEFAULT_TEMPLATE_ID";
                options.DefaultState = "formal";
                options.DefaultLanguage = "zh_CN";
            });
        }

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            // Thay cách gửi thật bằng triển khai giả dạng thu thập, tránh gọi thật tới giao diện WeChat
            context.Services.Replace(
                ServiceDescriptor.Singleton<ISubscribeMessager, FakeSubscribeMessager>());
        }
    }
}
