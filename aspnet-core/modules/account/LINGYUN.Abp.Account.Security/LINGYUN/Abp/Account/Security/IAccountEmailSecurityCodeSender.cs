using System;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Account.Security;
/// <summary>
/// Giao diện gửi mã bảo mật qua email
/// </summary>
public interface IAccountEmailSecurityCodeSender
{
    /// <summary>
    /// Gửi mã xác minh đăng nhập qua email
    /// </summary>
    /// <param name="code">Mã xác minh</param>
    /// <param name="userName">Tên người dùng</param>
    /// <param name="emailAddress">Địa chỉ email</param>
    /// <returns></returns>
    Task SendLoginCodeAsync(
        string code,
        string userName,
        string emailAddress);
    /// <summary>
    /// Gửi liên kết xác nhận qua email
    /// </summary>
    /// <param name="userId">Id người dùng</param>
    /// <param name="userEmail">Email người dùng</param>
    /// <param name="confirmToken">Token xác nhận</param>
    /// <param name="appName">Tên ứng dụng</param>
    /// <param name="returnUrl">Đường dẫn callback</param>
    /// <param name="returnUrlHash">Hash đường dẫn callback</param>
    /// <param name="userTenantId">Id tenant của người dùng</param>
    /// <returns></returns>
    Task SendConfirmLinkAsync(
        Guid userId,
        string userEmail,
        string confirmToken,
        string appName,
        string? returnUrl = null,
        string? returnUrlHash = null,
        Guid? userTenantId = null
    );
}
