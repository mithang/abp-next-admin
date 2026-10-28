using LINGYUN.Abp.AuditLogging.OpenObserve.Localization;
using LINGYUN.Abp.OpenObserve;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Json;
using Volo.Abp.Localization;
using Volo.Abp.Localization.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Mô-đun Nhật ký kiểm toán OpenObserve
/// </summary>
/// <remarks>
/// Mô-đun không thực hiện bất kỳ xử lý nào đối với luồng dữ liệu (không thăm dò, không tạo, không sửa đổi cài đặt):
/// OpenObserve sẽ tự động tạo luồng dữ liệu khi ghi lần đầu, các cài đặt như chính sách lưu giữ vui lòng cấu hình phía OpenObserve
/// </remarks>
[DependsOn(
    typeof(AbpAuditLoggingModule),
    typeof(AbpOpenObserveModule),
    typeof(AbpJsonModule),
    typeof(AbpLocalizationModule))]
public class AbpAuditLoggingOpenObserveModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();

        Configure<AbpAuditLoggingOpenObserveOptions>(configuration.GetSection("AuditLogging:OpenObserve"));

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Add<AuditLoggingOpenObserveResource>()
                .AddVirtualJson("/LINGYUN/Abp/AuditLogging/OpenObserve/Localization/Resources");
        });

        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<AbpAuditLoggingOpenObserveModule>();
        });

        Configure<AbpExceptionLocalizationOptions>(options =>
        {
            options.MapCodeNamespace(AuditLoggingOpenObserveErrorCodes.Namespace, typeof(AuditLoggingOpenObserveResource));
        });
    }
}
