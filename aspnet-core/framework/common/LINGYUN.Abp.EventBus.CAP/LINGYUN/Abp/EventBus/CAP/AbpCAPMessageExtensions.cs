using DotNetCore.CAP.Messages;
using System;

namespace LINGYUN.Abp.EventBus.CAP;

/// <summary>
/// Mở rộng thông điệp CAP
/// </summary>
public static class AbpCAPMessageExtensions
{
    /// <summary>
    /// Thử lấy định danh tenant trong tiêu đề thông điệp
    /// </summary>
    /// <param name="message"></param>
    /// <param name="tenantId"></param>
    /// <returns></returns>
    public static bool TryGetTenantId(
        this Message message,
        out Guid? tenantId)
    {
        if (message.Headers.TryGetValue(AbpCAPHeaders.TenantId, out var tenantStr))
        {
            if (Guid.TryParse(tenantStr, out var id))
            {
                tenantId = id;
                return true;
            }
        }
        tenantId = null;
        return false;
    }
    /// <summary>
    /// Lấy định danh tenant trong tiêu đề thông điệp
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    public static Guid? GetTenantIdOrNull(
        this Message message)
    {
        if (message.TryGetTenantId(out var tenantId))
        {
            return tenantId;
        }
        return null;
    }
    /// <summary>
    /// Thử lấy định danh liên kết trong tiêu đề thông điệp
    /// </summary>
    /// <param name="message"></param>
    /// <param name="correlationId"></param>
    /// <returns></returns>
    public static bool TryGetCorrelationId(
        this Message message,
        out string? correlationId)
    {
        return message.Headers.TryGetValue(AbpCAPHeaders.CorrelationId, out correlationId);
    }
    /// <summary>
    /// Lấy định danh liên kết trong tiêu đề thông điệp
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    public static string? GetCorrelationIdOrNull(this Message message)
    {
        if (message.TryGetCorrelationId(out var correlationId))
        {
            return correlationId;
        }
        return null;
    }
}
