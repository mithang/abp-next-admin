using LINGYUN.Abp.OpenObserve;
using LINGYUN.Abp.OpenObserve.Models.Stream;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Modularity;
using Volo.Abp.Threading;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

[DependsOn(
    typeof(AbpAuditLoggingTestModule),
    typeof(AbpAuditLoggingOpenObserveModule))]
public class AbpAuditLoggingOpenObserveTestModule : AbpModule
{
    private const string UserSecretsId = "376A428E-4806-44BA-BF39-FA6F0E085982";

    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.ReplaceConfiguration(ConfigurationHelper.BuildConfiguration(builderAction: builder =>
        {
            builder.AddUserSecrets(UserSecretsId);
        }));
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Kiểm thử tích hợp dùng luồng dữ liệu riêng cho từng instance host, tránh dữ liệu lịch sử ảnh hưởng đến assert đếm
        // (AbpIntegratedTest tạo instance host mới cho mỗi phương thức kiểm thử, chỉ dùng timestamp sẽ bị trùng luồng dữ liệu do va chạm cùng giây)
        var suffix = $"{DateTime.Now:yyyyMMddHHmmss}{Guid.NewGuid():N}"[..22];

        Configure<AbpAuditLoggingOpenObserveOptions>(options =>
        {
            options.AuditLogStream = $"audit_log_test_{suffix}";
            options.SecurityLogStream = $"security_log_test_{suffix}";
            // Luồng dữ liệu thay đổi thực thể/thao tác được tính từ AuditLogStream: {AuditLogStream}_entity_changes / _actions
        });

        // Thu thập log để assert (ví dụ cảnh báo "luồng dữ liệu không tồn tại")
        context.Services.AddLogging(builder => builder.AddProvider(new TestLoggerProvider()));
    }

    public override void OnApplicationShutdown(ApplicationShutdownContext context)
    {
        AsyncHelper.RunSync(async () => await OnApplicationShutdownAsync(context));
    }

    public async override Task OnApplicationShutdownAsync(ApplicationShutdownContext context)
    {
        await RemoveTestStreamsAsync(context.ServiceProvider);
    }

    private async static Task RemoveTestStreamsAsync(IServiceProvider serviceProvider)
    {
        var options = serviceProvider.GetRequiredService<IOptions<AbpAuditLoggingOpenObserveOptions>>().Value;
        var client = serviceProvider.GetRequiredService<OpenObserveClient>();

        var response = await client.GetStreamsAsync(
            options.Organization,
            fetchSchema: false,
            type: StreamType.Logs);

        // Luồng dữ liệu được tách biệt theo tenant, luồng dữ liệu của tenant có tên cơ sở làm tiền tố (ví dụ audit_log_test_xxx_<tenantId>), do đó dọn dẹp bằng cách khớp tiền tố
        var prefixes = new List<string>
        {
            options.AuditLogStream,
            options.SecurityLogStream,
        };
        if (options.WriteActions)
        {
            prefixes.Add(options.GetActionStream());
        }
        if (options.WriteEntityChanges)
        {
            prefixes.Add(options.GetEntityChangeStream());
        }

        var targets = response.List
            .Select(stream => stream.Name)
            .Where(name => prefixes.Any(prefix => name.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        foreach (var target in targets)
        {
            await client.DeleteStreamAsync(
                target,
                StreamType.Logs,
                true,
                options.Organization);
        }
    }
}
