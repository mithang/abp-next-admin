using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.DataProtectionManagement;
public class EntityTypeInfoDto : AuditedEntityDto<Guid>
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
    /// Tên đầy đủ của loại
    /// </summary>
    public string TypeFullName { get; set; } = default!;
    /// <summary>
    /// Có bật kiểm tra dữ liệu hay không
    /// </summary>
    public bool IsAuditEnabled { get; set; }
    /// <summary>
    /// Danh sách thuộc tính thực thể
    /// </summary>
    public virtual List<EntityPropertyInfoDto> Properties { get; set; } = new List<EntityPropertyInfoDto>();
}
