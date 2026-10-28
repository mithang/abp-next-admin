using LINGYUN.Abp.MicroService.AIService;
using Serilog;
using Volo.Abp.IO;
using Volo.Abp.Modularity.PlugIns;

public class Program
{
    public async static Task<int> Main(string[] args)
    {
        try
        {
            Console.Title = "AIService";
            Log.Information("Starting AIService.");

            var builder = WebApplication.CreateBuilder(args);
            builder.Host.AddAppSettingsSecretsJson()
                .UseAutofac()
                .ConfigureAppConfiguration((context, config) =>
                {
                    if (context.Configuration.GetValue("AgileConfig:IsEnabled", false))
                    {
                        config.AddAgileConfig(new AgileConfig.Client.ConfigClient(context.Configuration));
                    }
                })
                .UseSerilog((context, provider, config) =>
                {
                    config.ReadFrom.Configuration(context.Configuration);
                });
            await builder.AddApplicationAsync<AIServiceModule>(options =>
            {
                AIServiceModule.ApplicationName = Environment.GetEnvironmentVariable("APPLICATION_NAME")
                    ?? AIServiceModule.ApplicationName;
                options.ApplicationName = AIServiceModule.ApplicationName;
                // Lấy cấu hình bí mật người dùng từ biến môi trường, phù hợp để kiểm thử container
                options.Configuration.UserSecretsId = Environment.GetEnvironmentVariable("APPLICATION_USER_SECRETS_ID");
                // Nếu container không chỉ định bí mật người dùng, đọc từ dự án
                options.Configuration.UserSecretsAssembly = typeof(AIServiceModule).Assembly;
                // Tìm kiếm tất cả tệp trong thư mục Modules làm plugin
                // Hủy tham chiếu hiển thị tới mô-đun của tất cả các dự án khác, chuyển sang tham chiếu dưới dạng plugin
                var pluginFolder = Path.Combine(
                        Directory.GetCurrentDirectory(), "Modules");
                DirectoryHelper.CreateIfNotExists(pluginFolder);
                options.PlugInSources.AddFolder(
                    pluginFolder,
                    SearchOption.AllDirectories);
            });
            var app = builder.Build();
            await app.InitializeApplicationAsync();
            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly!");
            Console.WriteLine("Host terminated unexpectedly!");
            Console.WriteLine(ex.ToString());
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}

