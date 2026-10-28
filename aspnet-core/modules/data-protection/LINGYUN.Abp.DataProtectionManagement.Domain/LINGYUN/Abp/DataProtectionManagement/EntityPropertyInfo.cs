using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Guids;

namespace LINGYUN.Abp.DataProtectionManagement;

public class EntityPropertyInfo : Entity<Guid>
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
    /// Tên đầy đủ của kiểu
    /// </summary>
    public virtual string TypeFullName { get; protected set; } = default!;
    /// <summary>
    /// Kiểu Js
    /// </summary>
    public virtual string JavaScriptType { get; protected set; } = default!;
    /// <summary>
    /// Kiểu sở hữu
    /// </summary>
    public virtual EntityTypeInfo TypeInfo { get; protected set; } = default!;
    /// <summary>
    /// Định danh kiểu sở hữu
    /// </summary>
    public virtual Guid TypeInfoId { get; protected set; }
    /// <summary>
    /// Danh sách enum
    /// </summary>
    public virtual ICollection<EntityEnumInfo> Enums { get; protected set; }

    protected EntityPropertyInfo()
    {
        Enums = new Collection<EntityEnumInfo>();
    }

    public EntityPropertyInfo(
        Guid id,
        Guid typeInfoId,
        string name, 
        string displayName, 
        string typeFullName,
        string javaScriptType)
        : base(id)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), EntityPropertyInfoConsts.MaxNameLength);
        DisplayName = Check.NotNullOrWhiteSpace(displayName, nameof(displayName), EntityPropertyInfoConsts.MaxDisplayNameLength);
        TypeFullName = Check.NotNullOrWhiteSpace(typeFullName, nameof(typeFullName), EntityPropertyInfoConsts.MaxTypeFullNameLength);
        JavaScriptType = Check.NotNullOrWhiteSpace(javaScriptType, nameof(javaScriptType), EntityPropertyInfoConsts.MaxTypeFullNameLength);
        TypeInfoId = typeInfoId;

        Enums = new Collection<EntityEnumInfo>();
    }

    public EntityEnumInfo? FindEnum(string name)
    {
        return Enums.FirstOrDefault(x => x.Name == name);
    }

    public void RemoveEnum(string name)
    {
        Enums.RemoveAll(x => x.Name == name);
    }

    public EntityEnumInfo AddEnum(
        IGuidGenerator guidGenerator,
        string name,
        string displayName,
        string value)
    {
        if (HasExistsEnum(name))
        {
            throw new BusinessException(DataProtectionManagementErrorCodes.EntityTypeInfo.DuplicateEnum)
                .WithData(nameof(EntityEnumInfo.Name), name);
        }

        var enumInfo = new EntityEnumInfo(
            guidGenerator.Create(),
            Id,
            name,
            displayName,
            value);

        Enums.Add(enumInfo);

        return enumInfo;
    }

    public bool HasExistsEnum(string name)
    {
        return Enums.Any(x => x.Name == name);
    }
}
