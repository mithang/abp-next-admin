using System;

namespace LINGYUN.Abp.Elsa;
/// <summary>
/// Hỗ trợ đa tenant
/// </summary>
/// <remarks>
/// Để tương thích giữa elsa và abp, tốt nhất vẫn nên chỉ định trường đa tenant
/// </remarks>
public interface IMultiTenantActivitySupport
{
    Guid? TenantId { get; set; }
}
