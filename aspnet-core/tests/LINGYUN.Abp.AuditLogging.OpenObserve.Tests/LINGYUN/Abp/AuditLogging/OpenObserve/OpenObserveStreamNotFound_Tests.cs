using Microsoft.Extensions.Logging;
using Shouldly;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Xử lý khi luồng dữ liệu không tồn tại
/// </summary>
/// <remarks>
/// Khi OpenObserve chưa từng ghi dữ liệu thì luồng dữ liệu chưa được tạo, truy vấn được xử lý như kết quả rỗng và ghi nhật ký cảnh báo
/// </remarks>
public class OpenObserveStreamNotFound_Tests : AbpAuditLoggingOpenObserveTestBase
{
    private readonly IAuditLogManager _manager;
    private readonly ICurrentTenant _currentTenant;

    public OpenObserveStreamNotFound_Tests()
    {
        _manager = GetRequiredService<IAuditLogManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Should_Log_Warning_When_Stream_Not_Found()
    {
        TestLoggerProvider.Clear();

        var tenantId = Guid.NewGuid();

        // Tenant này chưa từng ghi dữ liệu, luồng dữ liệu của nó chưa được tạo
        using (_currentTenant.Change(tenantId))
        {
            (await _manager.GetCountAsync()).ShouldBe(0);
        }

        var warning = TestLoggerProvider.Entries
            .FirstOrDefault(entry => entry.Level == LogLevel.Warning &&
                                     entry.Message.Contains("does not exist yet", StringComparison.OrdinalIgnoreCase));

        warning.ShouldNotBeNull();
        // Danh mục nhật ký là kiểu của trình quản lý (do ILogger<T> được lớp con inject quyết định)
        warning!.Category.ShouldContain("OpenObserveAuditLogManager");
    }
}
