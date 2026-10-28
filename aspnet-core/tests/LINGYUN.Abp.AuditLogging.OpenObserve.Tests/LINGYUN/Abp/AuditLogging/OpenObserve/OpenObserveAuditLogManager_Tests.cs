using Shouldly;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

public class OpenObserveAuditLogManager_Tests : AuditLogManager_Tests<AbpAuditLoggingOpenObserveTestModule>
{
    private readonly IAuditLogManager _manager;

    public OpenObserveAuditLogManager_Tests()
    {
        _manager = GetRequiredService<IAuditLogManager>();
    }

    /// <summary>
    /// OpenObserve không hỗ trợ xóa bản ghi
    /// </summary>
    /// <remarks>
    /// Trường hợp dùng chung sẽ dọn dữ liệu ở cuối, tại đây ghi đè và khẳng định ngoại lệ nghiệp vụ cùng mã lỗi được ném ra
    /// </remarks>
    protected override async Task DeleteAsync(Guid id)
    {
        var exception = await Should.ThrowAsync<BusinessException>(() => _manager.DeleteAsync(id));

        exception.Code.ShouldBe(AuditLoggingOpenObserveErrorCodes.DeleteNotSupported);
    }

    protected override async Task DeleteManyAsync(List<Guid> ids)
    {
        var exception = await Should.ThrowAsync<BusinessException>(() => _manager.DeleteManyAsync(ids));

        exception.Code.ShouldBe(AuditLoggingOpenObserveErrorCodes.DeleteNotSupported);
    }
}
