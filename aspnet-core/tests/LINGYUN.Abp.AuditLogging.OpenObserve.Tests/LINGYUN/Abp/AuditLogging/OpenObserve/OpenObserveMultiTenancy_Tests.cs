using Shouldly;
using System;
using System.Threading.Tasks;
using Volo.Abp.Auditing;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Kiểm thử cách ly đa tenant
/// </summary>
/// <remarks>
/// Tham khảo triển khai Elasticsearch: tenant khác nhau dùng luồng dữ liệu khác nhau, ghi theo tenant của chính nhật ký, truy vấn theo tenant hiện tại
/// </remarks>
public class OpenObserveMultiTenancy_Tests : AbpAuditLoggingOpenObserveTestBase
{
    private readonly IAuditLogWriter _writer;
    private readonly IAuditLogManager _manager;
    private readonly ICurrentTenant _currentTenant;

    public OpenObserveMultiTenancy_Tests()
    {
        _writer = GetRequiredService<IAuditLogWriter>();
        _manager = GetRequiredService<IAuditLogManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Should_Isolate_Audit_Logs_By_Tenant()
    {
        var tenantId = Guid.NewGuid();

        var auditLogInfo = new AuditLogInfo
        {
            TenantId = tenantId,
            ExecutionTime = DateTime.Now,
            UserName = "_tenant_user",
        };

        var id = Guid.Parse(await _writer.WriteAsync(auditLogInfo));

        await Task.Delay(10000);

        // Host (chưa chỉ định tenant) không thấy luồng dữ liệu của tenant
        (await _manager.GetAsync(id)).ShouldBeNull();
        (await _manager.GetCountAsync()).ShouldBe(0);

        // Sau khi chuyển sang tenant thì thấy được
        using (_currentTenant.Change(tenantId))
        {
            (await _manager.GetAsync(id)).ShouldNotBeNull();
            (await _manager.GetCountAsync()).ShouldBe(1);
        }
    }
}
