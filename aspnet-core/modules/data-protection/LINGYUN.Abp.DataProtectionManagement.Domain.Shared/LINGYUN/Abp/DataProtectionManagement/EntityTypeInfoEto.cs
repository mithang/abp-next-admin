using System;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.DataProtectionManagement;

[Serializable]
[EventName("abp.data_protection.entity_type_info")]
public class EntityTypeInfoEto : EntityEto<Guid>
{
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public string DisplayName { get; set; } = default!;
    /// <summary>
    /// Tên đầy đủ của kiểu
    /// </summary>
    public string TypeFullName { get; set; } = default!;
    /// <summary>
    /// Có bật kiểm toán dữ liệu hay không
    /// </summary>
    public bool IsAuditEnabled { get; set; }
}
