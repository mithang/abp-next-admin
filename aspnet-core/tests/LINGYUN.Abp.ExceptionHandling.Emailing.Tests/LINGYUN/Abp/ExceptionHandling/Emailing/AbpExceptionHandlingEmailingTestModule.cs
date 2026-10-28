using LINGYUN.Abp.Tests;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Volo.Abp;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;
using Volo.Abp.Security.Encryption;

namespace LINGYUN.Abp.ExceptionHandling.Emailing
{
    [DependsOn(
        typeof(AbpEmailingExceptionHandlingModule),
        typeof(AbpTestsBaseModule),
        typeof(AbpAutofacModule)
        )]
    public class AbpExceptionHandlingEmailingTestModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            var configurationOptions = new AbpConfigurationBuilderOptions
            {
                BasePath = @"D:\Projects\Development\Abp\ExceptionHandling\Emailing",
                EnvironmentName = "Development"
            };

            context.Services.ReplaceConfiguration(ConfigurationHelper.BuildConfiguration(configurationOptions));
        }

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            // Mã hóa/giải mã
            Configure<AbpStringEncryptionOptions>(options =>
            {
                options.DefaultPassPhrase = "s46c5q55nxpeS8Ra";
                options.InitVectorBytes = Encoding.ASCII.GetBytes("s83ng0abvd02js84");
                options.DefaultSalt = Encoding.ASCII.GetBytes("sf&5)s3#");
            });

            // Tùy chỉnh các ngoại lệ cần xử lý
            Configure<AbpExceptionHandlingOptions>(options =>
            {
                //  Thêm loại ngoại lệ cần xử lý
                options.Handlers.Add<AbpException>();
            });
            // Tùy chỉnh các loại ngoại lệ cần gửi thông báo email
            Configure<AbpEmailExceptionHandlingOptions>(options =>
            {
                // Có gửi thông tin stack trace hay không
                options.SendStackTrace = true;
                // Email nhận mặc định khi chưa chỉ định người nhận ngoại lệ
                options.DefaultReceiveEmail = "colin.in@foxmail.com";
                //  Chỉ định một loại ngoại lệ gửi tới email nào
                options.HandReceivedException<AbpException>("colin.in@foxmail.com");
                options.HandReceivedException<TestSendEmailException>("colin.in@foxmail.com");
            });
        }
    }
}
