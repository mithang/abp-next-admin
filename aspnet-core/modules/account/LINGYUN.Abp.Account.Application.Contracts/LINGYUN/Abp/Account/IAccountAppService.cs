using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.Account;

public interface IAccountAppService : IApplicationService
{
    /// <summary>
    /// Đăng ký tài khoản người dùng bằng số điện thoại
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task RegisterAsync(PhoneRegisterDto input);
    /// <summary>
    /// Đăng ký tài khoản người dùng qua Mini Program WeChat
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task RegisterAsync(WeChatRegisterDto input);
    /// <summary>
    /// Đặt lại mật khẩu người dùng bằng số điện thoại
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task ResetPasswordAsync(PhoneResetPasswordDto input);
    /// <summary>
    /// Gửi tin nhắn SMS mã xác minh đăng ký qua điện thoại
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SendPhoneRegisterCodeAsync(SendPhoneRegisterCodeDto input);
    /// <summary>
    /// Gửi tin nhắn SMS mã xác minh đăng nhập qua điện thoại
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SendPhoneSigninCodeAsync(SendPhoneSigninCodeDto input);
    /// <summary>
    /// Gửi tin nhắn SMS mã xác minh đặt lại mật khẩu qua điện thoại
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SendPhoneResetPasswordCodeAsync(SendPhoneResetPasswordCodeDto input);
    /// <summary>
    /// Gửi mã xác minh đăng ký qua email
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SendEmailRegisterCodeAsync(SendEmailRegisterCodeDto input);
    /// <summary>
    /// Xác minh mã xác minh đăng ký qua email
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<bool> VerifyEmailRegisterCodeAsync(VerifyEmailRegisterCodeInput input);
    /// <summary>
    /// Gửi mã xác minh đăng nhập qua email
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SendEmailSigninCodeAsync(SendEmailSigninCodeDto input);
    /// <summary>
    /// Gửi liên kết xác nhận email
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SendEmailConfirmLinkAsync(SendUserEmailConfirmCodeDto input);
    /// <summary>
    /// Xác nhận địa chỉ email
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task ConfirmEmailAsync(ConfirmUserEmailInput input);
    /// <summary>
    /// Lấy danh sách nhà cung cấp xác thực hai yếu tố của người dùng
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<ListResultDto<NameValue>> GetTwoFactorProvidersAsync(GetTwoFactorProvidersInput input);
}
