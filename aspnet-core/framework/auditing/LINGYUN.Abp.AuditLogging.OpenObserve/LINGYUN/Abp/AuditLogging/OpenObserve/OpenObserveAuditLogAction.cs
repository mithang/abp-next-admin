using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using Volo.Abp.Data;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Bản ghi thao tác đã làm phẳng (ghi vào luồng dữ liệu thao tác OpenObserve)
/// </summary>
/// <remarks>
/// <see cref="AuditLogAction.Parameters"/> có thể rất lớn khi thao tác với khối lượng dữ liệu lớn, vì vậy thao tác được làm phẳng và ghi vào
/// <c>{AuditLogStream}_actions</c> là luồng dữ liệu độc lập; khi truy vấn, trước tiên khớp trong luồng dữ liệu này <c>auditlogid</c>,
/// sau đó quay lại luồng dữ liệu chính để lọc theo id
/// </remarks>
public class OpenObserveAuditLogAction
{
    /// <summary>
    /// Thời gian tài liệu OpenObserve (micro giây)
    /// </summary>
    /// <remarks>
    /// Được <see cref="AuditLogAction.ExecutionTime"/> ghi đè; khi null sẽ sử dụng thời gian ghi phía máy chủ
    /// </remarks>
    [JsonPropertyName("_timestamp")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public long? Timestamp { get; set; }

    public Guid Id { get; set; }

    public Guid AuditLogId { get; set; }

    public Guid? TenantId { get; set; }

    public string ServiceName { get; set; }

    public string MethodName { get; set; }

    public string Parameters { get; set; }

    public DateTime ExecutionTime { get; set; }

    public int ExecutionDuration { get; set; }

    /// <summary>
    /// Người dùng của nhật ký kiểm toán sở hữu (dư thừa, thuận tiện cho việc tra cứu độc lập)
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// Tên người dùng của nhật ký kiểm toán sở hữu (dư thừa, thuận tiện cho việc tra cứu độc lập)
    /// </summary>
    public string? UserName { get; set; }

    public ExtraPropertyDictionary ExtraProperties { get; set; }

    public OpenObserveAuditLogAction()
    {
        ServiceName = string.Empty;
        MethodName = string.Empty;
        Parameters = string.Empty;
        ExtraProperties = new ExtraPropertyDictionary();
    }

    /// <summary>
    /// Tạo bản ghi đã làm phẳng từ nhật ký kiểm toán và thao tác
    /// </summary>
    public static OpenObserveAuditLogAction From(AuditLog auditLog, AuditLogAction action)
    {
        return new OpenObserveAuditLogAction
        {
            Id = action.Id,
            AuditLogId = action.AuditLogId,
            TenantId = action.TenantId ?? auditLog.TenantId,
            ServiceName = action.ServiceName,
            MethodName = action.MethodName,
            Parameters = action.Parameters,
            ExecutionTime = action.ExecutionTime,
            ExecutionDuration = action.ExecutionDuration,
            UserId = auditLog.UserId,
            UserName = auditLog.UserName,
            ExtraProperties = action.ExtraProperties ?? new ExtraPropertyDictionary(),
        };
    }

    /// <summary>
    /// Khôi phục thành thao tác
    /// </summary>
    public virtual AuditLogAction ToAuditLogAction()
    {
        return new AuditLogAction
        {
            Id = Id,
            AuditLogId = AuditLogId,
            TenantId = TenantId,
            ServiceName = ServiceName,
            MethodName = MethodName,
            Parameters = Parameters,
            ExecutionTime = ExecutionTime,
            ExecutionDuration = ExecutionDuration,
            ExtraProperties = ExtraProperties ?? new ExtraPropertyDictionary(),
        };
    }

    /// <summary>
    /// Tạo hàng loạt bản ghi đã làm phẳng
    /// </summary>
    public static List<OpenObserveAuditLogAction> CreateMany(AuditLog auditLog)
    {
        return auditLog.Actions?
            .Select(action => From(auditLog, action))
            .ToList()
            ?? new List<OpenObserveAuditLogAction>();
    }
}
