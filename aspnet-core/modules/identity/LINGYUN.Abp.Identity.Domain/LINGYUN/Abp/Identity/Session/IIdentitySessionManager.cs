using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Identity.Session;
/// <summary>
/// Quản lý phiên làm việc của người dùng
/// </summary>
public interface IIdentitySessionManager
{
    /// <summary>
    /// Lưu phiên làm việc
    /// </summary>
    /// <param name="claimsPrincipal">Chủ thể danh tính người dùng</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task SaveSessionAsync(
        ClaimsPrincipal claimsPrincipal,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lưu phiên làm việc
    /// </summary>
    /// <param name="clientId">Id máy khách</param>
    /// <param name="claimsPrincipal">Chủ thể danh tính người dùng</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task SaveSessionAsync(
        string? clientId,
        ClaimsPrincipal claimsPrincipal,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thu hồi phiên làm việc của người dùng
    /// </summary>
    /// <param name="sessionId">Id phiên làm việc</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RevokeSessionAsync(
        string sessionId,
        CancellationToken cancellationToken = default);
}
