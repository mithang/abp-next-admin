using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.Account;

public interface IMyClaimAppService : IApplicationService
{
    /// <summary>
    /// Truy vấn trạng thái liên kết
    /// </summary>
    /// <param name="claimType"></param>
    /// <returns></returns>
    Task<GetUserClaimStateDto> GetStateAsync(string claimType);
    /// <summary>
    /// Đặt lại trạng thái liên kết
    /// </summary>
    /// <param name="claimType"></param>
    /// <returns></returns>
    Task ResetAsync(string claimType);
}
