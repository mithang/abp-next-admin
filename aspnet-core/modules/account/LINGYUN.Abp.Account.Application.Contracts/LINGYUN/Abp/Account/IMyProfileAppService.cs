using LINGYUN.Abp.Identity;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Content;

namespace LINGYUN.Abp.Account;

public interface IMyProfileAppService : IApplicationService
{
    /// <summary>
    /// Lấy thông tin trình xác thực
    /// </summary>
    /// <returns></returns>
    Task<AuthenticatorDto> GetAuthenticatorAsync();
    /// <summary>
    /// Xác minh mã trình xác thực
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<AuthenticatorRecoveryCodeDto> VerifyAuthenticatorCodeAsync(VerifyAuthenticatorCodeInput input);
    /// <summary>
    /// Lấy danh sách phiên
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<IdentitySessionDto>> GetSessionsAsync(GetMySessionsInput input);
    /// <summary>
    /// Thu hồi phiên
    /// </summary>
    /// <param name="sessionId">id phiên</param>
    /// <returns></returns>
    Task RevokeSessionAsync(string sessionId);
    /// <summary>
    /// Đặt lại trình xác thực
    /// </summary>
    /// <returns></returns>
    Task ResetAuthenticatorAsync();
    /// <summary>
    /// Lấy trạng thái xác thực hai yếu tố
    /// </summary>
    /// <returns></returns>
    Task<TwoFactorEnabledDto> GetTwoFactorEnabledAsync();
    /// <summary>
    /// Thay đổi xác thực hai yếu tố
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task ChangeTwoFactorEnabledAsync(TwoFactorEnabledDto input);
    /// <summary>
    /// Gửi mã xác minh đổi số điện thoại
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SendChangePhoneNumberCodeAsync(SendChangePhoneNumberCodeInput input);
    /// <summary>
    /// Thay đổi liên kết số điện thoại
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    /// <remarks>
    /// Cần xác thực hai yếu tố, chủ yếu vì có những nơi không thể dùng trang chuyển hướng để sửa thông tin liên quan (điển hình là mini program WeChat)
    /// </remarks>
    Task ChangePhoneNumberAsync(ChangePhoneNumberInput input);
    /// <summary>
    /// Gửi liên kết xác nhận email
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SendEmailConfirmLinkAsync(SendEmailConfirmCodeDto input);
    /// <summary>
    /// Xác nhận địa chỉ email
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task ConfirmEmailAsync(ConfirmEmailInput input);
    /// <summary>
    /// Thay đổi ảnh đại diện người dùng
    /// </summary>
    /// <returns></returns>
    Task ChangePictureAsync(ChangePictureInput input);
    /// <summary>
    /// Lấy ảnh đại diện người dùng
    /// </summary>
    /// <returns></returns>
    Task<IRemoteStreamContent> GetPictureAsync();
}
