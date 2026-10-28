using System.Collections.Generic;
using System.Text.Json.Serialization;
using Volo.Abp.Data;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Tài liệu nhật ký kiểm toán ghi vào OpenObserve
/// </summary>
/// <remarks>
/// Kế thừa <see cref="AuditLog"/> và bổ sung cột <c>_timestamp</c> (được ghi đè bởi <see cref="AuditLog.ExecutionTime"/>);
/// Thay đổi thực thể và thao tác được ghi vào luồng dữ liệu độc lập do AuditLogStream tính toán
/// </remarks>
public class OpenObserveAuditLog : AuditLog
{
    /// <summary>
    /// Thời gian tài liệu OpenObserve (micro giây)
    /// </summary>
    /// <remarks>
    /// Được ghi đè bởi <see cref="AuditLog.ExecutionTime"/>; khi null sẽ dùng thời gian ghi phía máy chủ
    /// </remarks>
    [JsonPropertyName("_timestamp")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public long? Timestamp { get; set; }

    public static OpenObserveAuditLog From(AuditLog auditLog)
    {
        return new OpenObserveAuditLog
        {
            Id = auditLog.Id,
            ApplicationName = auditLog.ApplicationName,
            UserId = auditLog.UserId,
            UserName = auditLog.UserName,
            TenantId = auditLog.TenantId,
            TenantName = auditLog.TenantName,
            ImpersonatorUserId = auditLog.ImpersonatorUserId,
            ImpersonatorUserName = auditLog.ImpersonatorUserName,
            ImpersonatorTenantId = auditLog.ImpersonatorTenantId,
            ImpersonatorTenantName = auditLog.ImpersonatorTenantName,
            ExecutionTime = auditLog.ExecutionTime,
            ExecutionDuration = auditLog.ExecutionDuration,
            ClientIpAddress = auditLog.ClientIpAddress,
            ClientName = auditLog.ClientName,
            ClientId = auditLog.ClientId,
            CorrelationId = auditLog.CorrelationId,
            BrowserInfo = auditLog.BrowserInfo,
            HttpMethod = auditLog.HttpMethod,
            Url = auditLog.Url,
            Exceptions = auditLog.Exceptions,
            Comments = auditLog.Comments,
            HttpStatusCode = auditLog.HttpStatusCode,
            // Thay đổi thực thể và thao tác được ghi vào luồng dữ liệu độc lập (xem GetEntityChangeStream / GetActionStream), tài liệu chính không còn lưu trùng lặp, chi tiết lấy từ luồng con khi cần
            EntityChanges = new List<EntityChange>(),
            Actions = new List<AuditLogAction>(),
            ExtraProperties = auditLog.ExtraProperties ?? new ExtraPropertyDictionary(),
            // _timestamp được writer ghi đè theo AuditLog.ExecutionTime (xem OpenObserveTimestampHelper)
            Timestamp = null,
        };
    }
}
