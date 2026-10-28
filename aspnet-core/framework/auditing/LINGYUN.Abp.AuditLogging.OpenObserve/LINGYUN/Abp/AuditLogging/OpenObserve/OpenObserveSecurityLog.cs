using System;
using System.Text.Json.Serialization;
using Volo.Abp.Data;
using Volo.Abp.SecurityLog;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Ghi tài liệu nhật ký bảo mật vào OpenObserve
/// </summary>
/// <remarks>
/// Kế thừa <see cref="SecurityLog"/> và bổ sung <c>_timestamp</c> cột (được <see cref="SecurityLog.CreationTime"/> ghi đè)
/// </remarks>
public class OpenObserveSecurityLog : SecurityLog
{
    /// <summary>
    /// Thời gian tài liệu OpenObserve (micro giây)
    /// </summary>
    /// <remarks>
    /// Được <see cref="SecurityLog.CreationTime"/> ghi đè; khi null thì dùng thời gian ghi của phía máy chủ
    /// </remarks>
    [JsonPropertyName("_timestamp")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public long? Timestamp { get; set; }

    public static OpenObserveSecurityLog From(SecurityLog securityLog)
    {
        return new OpenObserveSecurityLog
        {
            Id = securityLog.Id,
            TenantId = securityLog.TenantId,
            TenantName = securityLog.TenantName,
            ApplicationName = securityLog.ApplicationName,
            Identity = securityLog.Identity,
            Action = securityLog.Action,
            UserId = securityLog.UserId,
            UserName = securityLog.UserName,
            ClientId = securityLog.ClientId,
            CorrelationId = securityLog.CorrelationId,
            ClientIpAddress = securityLog.ClientIpAddress,
            BrowserInfo = securityLog.BrowserInfo,
            CreationTime = securityLog.CreationTime,
            ExtraProperties = securityLog.ExtraProperties ?? new ExtraPropertyDictionary(),
            Timestamp = null,
        };
    }
}
