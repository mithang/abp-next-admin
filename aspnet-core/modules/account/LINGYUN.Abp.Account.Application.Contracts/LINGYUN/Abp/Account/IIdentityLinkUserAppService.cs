using LINGYUN.Abp.Account.Dto;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.Account;
/// <summary>
/// Giao diện dịch vụ ứng dụng người dùng liên kết
/// </summary>
public interface IIdentityLinkUserAppService : IApplicationService
{
    /// <summary>
    /// Người dùng liên kết
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task LinkAsync(LinkUserInput input);
    /// <summary>
    /// Hủy liên kết người dùng
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task UnlinkAsync(UnLinkUserInput input);
    /// <summary>
    /// Tạo Token người dùng liên kết
    /// </summary>
    /// <returns></returns>
    Task<string> GenerateLinkTokenAsync();
    /// <summary>
    /// Tạo Token đăng nhập người dùng liên kết
    /// </summary>
    /// <returns></returns>
    Task<string> GenerateLinkLoginTokenAsync();
    /// <summary>
    /// Lấy danh sách người dùng đã liên kết
    /// </summary>
    /// <returns></returns>
    Task<ListResultDto<LinkUserDto>> GetListAsync();
    /// <summary>
    /// Xác thực người dùng liên kết
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<VerifyLinkUserDto> VerifyLinkUserAsync(VerifyLinkUserInput input);
    /// <summary>
    /// Xác thực Token người dùng liên kết
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<bool> VerifyLinkTokenAsync(VerifyLinkTokenInput input);
    /// <summary>
    /// Xác thực Token đăng nhập người dùng liên kết
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<bool> VerifyLinkLoginTokenAsync(VerifyLinkTokenInput input);
}
