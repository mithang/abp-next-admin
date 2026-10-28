using System;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.DataProtectionManagement;

public class EntityEnumInfoDto : EntityDto<Guid>
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
    /// Giá trị enum
    /// </summary>
    public string Value { get; set; } = default!;
}
