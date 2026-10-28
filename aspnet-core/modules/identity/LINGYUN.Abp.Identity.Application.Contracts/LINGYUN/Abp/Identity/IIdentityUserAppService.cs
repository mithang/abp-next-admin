using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.Identity;

public interface IIdentityUserAppService : IApplicationService
{

    #region OrganizationUnit

    Task<ListResultDto<OrganizationUnitDto>> GetOrganizationUnitsAsync(Guid id);

    Task SetOrganizationUnitsAsync(Guid id, IdentityUserOrganizationUnitUpdateDto input);

    Task RemoveOrganizationUnitsAsync(Guid id, Guid ouId);

    #endregion

    #region ClaimType

    Task<ListResultDto<IdentityClaimDto>> GetClaimsAsync(Guid id);

    Task AddClaimAsync(Guid id, IdentityUserClaimCreateDto input);

    Task UpdateClaimAsync(Guid id, IdentityUserClaimUpdateDto input);

    Task DeleteClaimAsync(Guid id, IdentityUserClaimDeleteDto input);

    #endregion

    /// <summary>
    /// Thay đổi tùy chọn xác thực hai yếu tố của người dùng
    /// </summary>
    /// <param name="id"></param>
    /// <param name="input"></param>
    /// <returns></returns>
    Task ChangeTwoFactorEnabledAsync(Guid id, TwoFactorEnabledDto input);
    /// <summary>
    /// Thay đổi mật khẩu người dùng
    /// </summary>
    /// <param name="id"></param>
    /// <param name="input"></param>
    /// <returns></returns>
    Task ChangePasswordAsync(Guid id, IdentityUserSetPasswordInput input);
    /// <summary>
    /// Khóa
    /// </summary>
    /// <param name="id"></param>
    /// <param name="seconds">Thời lượng khóa</param>
    /// <returns></returns>
    Task LockAsync(Guid id, int seconds);
    /// <summary>
    /// Mở khóa
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task UnLockAsync(Guid id);
}
