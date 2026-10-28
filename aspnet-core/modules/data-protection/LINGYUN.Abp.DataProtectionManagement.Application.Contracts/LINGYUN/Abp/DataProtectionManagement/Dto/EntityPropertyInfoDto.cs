using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.DataProtectionManagement;
public class EntityPropertyInfoDto : EntityDto<Guid>
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
    /// Loại Js
    /// </summary>
    public string JavaScriptType { get; set; } = default!;
    /// <summary>
    /// Danh sách enum
    /// </summary>
    public virtual List<EntityEnumInfoDto> Enums { get; set; } = new List<EntityEnumInfoDto>();
}
