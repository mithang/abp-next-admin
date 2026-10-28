using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.PushPlus.User;
/// <summary>
/// Giao diện người dùng
/// </summary>
public interface IPushPlusUserProvider
{
    /// <summary>
    /// Lấy token
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<string> GetMyTokenAsync(CancellationToken cancellationToken = default);
    /// <summary>
    /// Chi tiết hồ sơ cá nhân
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusUserProfile> GetMyProfileAsync(CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy thời gian còn lại trước khi gỡ chặn
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusUserLimitTime> GetMyLimitTimeAsync(CancellationToken cancellationToken = default);
}
