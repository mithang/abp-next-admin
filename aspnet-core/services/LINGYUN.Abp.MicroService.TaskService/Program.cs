using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.IO;
using System.Threading.Tasks;
using Volo.Abp.IO;
using Volo.Abp.Modularity.PlugIns;

namespace LINGYUN.Abp.MicroService.TaskService;

public class Program
{
    public async static Task<int> Main(string[] args)
    {
        try
        {
            Console.Title = "TaskService";
            Log.Information("Starting TaskService.");

            var builder = WebApplication.CreateBuilder(args);
            builder.Host.AddAppSettingsSecretsJson()
                .UseAutofac()
                .ConfigureAppConfiguration((context, config) =>
                {
                    // AgileConfig là nền tảng cấu hình phân tán, xếp cuối cùng nên có thể ghi đè mọi file cấu hình cục bộ
                    if (context.Configuration.GetValue("AgileConfig:IsEnabled", false))
                    {
                        config.AddAgileConfig(new AgileConfig.Client.ConfigClient(context.Configuration));
                    }
                })
                .UseSerilog((context, provider, config) =>
                {
                    config.ReadFrom.Configuration(context.Configuration);
                });
            await builder.AddApplicationAsync<TaskServiceModule>(options =>
            {
                TaskServiceModule.ApplicationName = Environment.GetEnvironmentVariable("APPLICATION_NAME")
                    ?? TaskServiceModule.ApplicationName;
                options.ApplicationName = TaskServiceModule.ApplicationName;
                // Lấy cấu hình bí mật người dùng từ biến môi trường, phù hợp để kiểm thử trong container
                options.Configuration.UserSecretsId = Environment.GetEnvironmentVariable("APPLICATION_USER_SECRETS_ID");
                // Nếu container không chỉ định bí mật người dùng thì đọc từ dự án
                options.Configuration.UserSecretsAssembly = typeof(TaskServiceModule).Assembly;
                // Tìm mọi file trong thư mục Modules để dùng làm plugin
                // Không tham chiếu trực tiếp mọi mô-đun của các dự án khác nữa, chuyển sang tham chiếu qua plugin
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
