namespace LINGYUN.Abp.Identity;

public class IdentityErrorCodes
{
    /// <summary>
    /// Không thể thay đổi loại claim tĩnh
    /// </summary>
    public const string StaticClaimTypeChange = "Volo.Abp.Identity:020005";
    /// <summary>
    /// Không thể xóa loại claim tĩnh
    /// </summary>
    public const string StaticClaimTypeDeletion = "Volo.Abp.Identity:020006";
    /// <summary>
    /// Số điện thoại đã được sử dụng
    /// </summary>
    public const string DuplicatePhoneNumber = "Volo.Abp.Identity:020007";
    /// <summary>
    /// Bạn không thể sửa thông tin liên kết điện thoại của mình
    /// </summary>
    public const string UsersCanNotChangePhoneNumber = "Volo.Abp.Identity:020008";
    /// <summary>
    /// Bạn không thể sửa thông tin liên kết email của mình
    /// </summary>
    public const string UsersCanNotChangeEmailAddress = "Volo.Abp.Identity:020009";
    /// <summary>
    /// Địa chỉ email xác nhận trùng lặp
    /// </summary>
    public const string DuplicateConfirmEmailAddress = "Volo.Abp.Identity:020010";
    /// <summary>
    /// Thử bật xác thực hai yếu tố khi chưa liên kết thiết bị MFA
    /// </summary>
    public const string ChangeTwoFactorWithMFANotBound = "Volo.Abp.Identity:020011";
    /// <summary>
    /// Mã xác thực của trình xác thực không hợp lệ
    /// </summary>
    public const string AuthenticatorTokenInValid = "Volo.Abp.Identity:020012";
    /// <summary>
    /// Mật khẩu không được trùng với mật khẩu đã dùng trong {0} lần gần nhất
    /// </summary>
    public const string PasswordInHistoryInValid = "Volo.Abp.Identity:020013";
    /// <summary>
    /// Token người dùng liên kết không hợp lệ
    /// </summary>
    public const string LinkUserTokenInValid = "Volo.Abp.Identity:020014";
    /// <summary>
    /// Cấm đặt vai trò quản trị viên làm vai trò mặc định
    /// </summary>
    public const string ProhibitSetDefaultAdminRole = "Volo.Abp.Identity:020015";
}
