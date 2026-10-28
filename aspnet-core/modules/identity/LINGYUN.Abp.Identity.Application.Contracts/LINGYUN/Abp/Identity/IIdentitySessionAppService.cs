using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.Identity;
public interface IIdentitySessionAppService
{
    /// <summary>
    /// Lấy danh sách phiên của người dùng
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<IdentitySessionDto>> GetSessionsAsync(GetUserSessionsInput input);
    /// <summary>
    /// Thu hồi phiên của người dùng
    /// </summary>
    /// <param name="sessionId">id phiên</param>
    /// <returns></returns>
    Task RevokeSessionAsync(string sessionId);
}
