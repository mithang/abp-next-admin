using LINGYUN.Abp.AuditLogging.OpenObserve.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.Auditing;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Bộ chuyển đổi tài liệu thay đổi thực thể
/// </summary>
/// <remarks>
/// OpenObserve lưu mảng lồng nhau dưới dạng cột chuỗi JSON, vì vậy chi tiết thuộc tính của thay đổi thực thể
/// (<c>propertychanges</c>) được tuần tự hóa trước khi ghi và giải tuần tự hóa sau khi đọc;
/// Logic chuyển đổi tập trung tại đây để giữ mô hình thực thể là đối tượng dữ liệu thuần túy
/// </remarks>
public class OpenObserveEntityChangeConverter : ITransientDependency
{
    protected IAuditLoggingOpenObserveSerializer Serializer { get; }

    public OpenObserveEntityChangeConverter(IAuditLoggingOpenObserveSerializer serializer)
    {
        Serializer = serializer;
    }

    /// <summary>
    /// Nhật ký kiểm toán -> tập hợp tài liệu thay đổi thực thể
    /// </summary>
    public virtual List<OpenObserveEntityChange> ToDocuments(AuditLog auditLog)
    {
        return auditLog.EntityChanges?
            .Select(entityChange => ToDocument(auditLog, entityChange))
            .ToList()
            ?? new List<OpenObserveEntityChange>();
    }

    /// <summary>
    /// Thay đổi thực thể -> tài liệu thay đổi thực thể
    /// </summary>
    public virtual OpenObserveEntityChange ToDocument(AuditLog auditLog, EntityChange entityChange)
    {
        return new OpenObserveEntityChange
        {
            Id = entityChange.Id,
            AuditLogId = entityChange.AuditLogId,
            TenantId = entityChange.TenantId,
            EntityTenantId = entityChange.EntityTenantId,
            ChangeTime = entityChange.ChangeTime,
            ChangeType = entityChange.ChangeType.ToString(),
            EntityId = entityChange.EntityId,
            EntityTypeFullName = entityChange.EntityTypeFullName,
            UserId = auditLog.UserId,
            UserName = auditLog.UserName,
            PropertyChangesJson = SerializePropertyChanges(entityChange.PropertyChanges),
            ExtraProperties = entityChange.ExtraProperties ?? new ExtraPropertyDictionary(),
        };
    }

    /// <summary>
    /// Tài liệu thay đổi thực thể -> thay đổi thực thể
    /// </summary>
    public virtual EntityChange ToEntityChange(OpenObserveEntityChange document)
    {
        return new EntityChange
        {
            Id = document.Id,
            AuditLogId = document.AuditLogId,
            TenantId = document.TenantId,
            EntityTenantId = document.EntityTenantId,
            ChangeTime = document.ChangeTime,
            ChangeType = ParseChangeType(document.ChangeType),
            EntityId = document.EntityId,
            EntityTypeFullName = document.EntityTypeFullName,
            PropertyChanges = DeserializePropertyChanges(document.PropertyChangesJson),
            ExtraProperties = document.ExtraProperties ?? new ExtraPropertyDictionary(),
        };
    }

    /// <summary>
    /// Tài liệu thay đổi thực thể -> thay đổi thực thể kèm tên người dùng
    /// </summary>
    public virtual EntityChangeWithUsername ToEntityChangeWithUsername(OpenObserveEntityChange document)
    {
        return new EntityChangeWithUsername
        {
            UserName = document.UserName,
            EntityChange = ToEntityChange(document),
        };
    }

    /// <summary>
    /// Tuần tự hóa chi tiết thay đổi thuộc tính
    /// </summary>
    protected virtual string? SerializePropertyChanges(IEnumerable<EntityPropertyChange>? propertyChanges)
    {
        var changes = propertyChanges?.ToList();

        return changes == null || changes.Count == 0
            ? null
            : Serializer.Serialize(changes);
    }

    /// <summary>
    /// Giải tuần tự hóa chi tiết thay đổi thuộc tính
    /// </summary>
    protected virtual List<EntityPropertyChange> DeserializePropertyChanges(string? propertyChangesJson)
    {
        return Serializer.Deserialize<List<EntityPropertyChange>>(propertyChangesJson ?? string.Empty)
            ?? new List<EntityPropertyChange>();
    }

    protected virtual EntityChangeType ParseChangeType(string changeType)
    {
        return Enum.TryParse<EntityChangeType>(changeType, ignoreCase: true, out var parsed)
            ? parsed
            : EntityChangeType.Updated;
    }
}
