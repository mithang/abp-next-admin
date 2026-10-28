using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace LINGYUN.Abp.DataProtectionManagement;

public class EntityEnumInfo : Entity<Guid>
{
    /// <summary>
    /// Tên
    /// </summary>
    public virtual string Name { get; protected set; } = default!;
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public virtual string DisplayName { get; protected set; } = default!;
    /// <summary>
    /// Giá trị enum
    /// </summary>
    public virtual string Value { get; protected set; } = default!;
    /// <summary>
    /// Thuộc tính sở hữu
    /// </summary>
    public virtual EntityPropertyInfo PropertyInfo { get; protected set; } = default!;
    /// <summary>
    /// Mã định danh thuộc tính sở hữu
    /// </summary>
    public virtual Guid PropertyInfoId { get; protected set; }
    protected EntityEnumInfo()
    {

    }

    public EntityEnumInfo(
        Guid id,
        Guid propertyInfoId,
        string name, 
        string displayName, 
        string value)
        : base(id)
    {
        PropertyInfoId = propertyInfoId;
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), EntityEnumInfoConsts.MaxNameLength);
        DisplayName = Check.NotNullOrWhiteSpace(displayName, nameof(displayName), EntityEnumInfoConsts.MaxDisplayNameLength);
        Value = Check.NotNullOrWhiteSpace(value, nameof(value), EntityEnumInfoConsts.MaxValueLength);
    }
}
