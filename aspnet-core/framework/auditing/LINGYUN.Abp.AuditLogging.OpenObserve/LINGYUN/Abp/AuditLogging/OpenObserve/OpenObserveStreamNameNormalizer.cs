using System;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Bộ chuẩn hóa tên luồng dữ liệu OpenObserve
/// </summary>
/// <remarks>
/// Luồng dữ liệu của tenant có dạng <c>audit_log_{tenantId:N}</c>, host (không chỉ định tenant) dùng tên cơ sở <c>audit_log</c>.
/// Khi ghi, truyền tường minh tenant của chính nhật ký (việc ghi nhật ký kiểm toán diễn ra trong hàng đợi nền, tenant hiện tại có thể không còn là tenant đã tạo ra nhật ký),
/// Khi truy vấn dùng tenant hiện tại
/// </remarks>
public class OpenObserveStreamNameNormalizer : IOpenObserveStreamNameNormalizer, ISingletonDependency
{
    /// <summary>
    /// Ký tự phân tách tenant
    /// </summary>
    /// <remarks>
    /// OpenObserve sẽ chuẩn hóa <c>-</c> trong tên luồng dữ liệu thành <c>_</c> (theo thực nghiệm),
    /// Vì vậy ở đây dùng trực tiếp <c>_</c>, tránh tên khi ghi và khi truy vấn không khớp nhau
    /// </remarks>
    public const char TenantSeparator = '_';

    protected ICurrentTenant CurrentTenant { get; }

    public OpenObserveStreamNameNormalizer(ICurrentTenant currentTenant)
    {
        CurrentTenant = currentTenant;
    }

    public virtual string NormalizeStream(string stream, Guid? tenantId = null)
    {
        if (stream.IsNullOrWhiteSpace())
        {
            return stream;
        }

        var tenant = tenantId ?? CurrentTenant.Id;

        return tenant.HasValue
            ? $"{stream}{TenantSeparator}{tenant.Value:N}"
            : stream;
    }
}
