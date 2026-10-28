namespace LINGYUN.Abp.Identity.Settings;

public static class IdentitySettingNames
{
    private const string Prefix = "Abp.Identity";
    public static class User
    {
        private const string UserPrefix = Prefix + ".User";
        /// <summary>
        /// Mẫu SMS xác thực số điện thoại người dùng
        /// </summary>
        public const string SmsPhoneNumberConfirmed = UserPrefix + ".SmsPhoneNumberConfirmed";
        /// <summary>
        /// Mã mẫu SMS xác thực khi đăng ký người dùng
        /// </summary>
        public const string SmsNewUserRegister = UserPrefix + ".SmsNewUserRegister";
        /// <summary>
        /// Mã mẫu SMS xác thực khi đăng nhập người dùng
        /// </summary>
        public const string SmsUserSignin = UserPrefix + ".SmsUserSignin";
        /// <summary>
        /// Mã mẫu SMS xác thực khi đặt lại mật khẩu người dùng
        /// </summary>
        public const string SmsResetPassword = UserPrefix + ".SmsResetPassword";
        /// <summary>
        /// Thời gian giãn cách lặp lại mã xác thực SMS
        /// </summary>
        public const string SmsRepetInterval = UserPrefix + ".SmsRepetInterval";
        /// <summary>
        /// Thời gian giãn cách lặp lại mã xác thực đăng ký qua email
        /// </summary>
        public const string EmailRegisterRepetInterval = UserPrefix + ".EmailRegisterRepetInterval";
    }

    public static class Session
    {
        private const string SessionPrefix = Prefix + ".Session";
        /// <summary>
        /// Chính sách đăng nhập đồng thời
        /// see: https://github.com/abpio/abp-commercial-docs/blob/dev/en/modules/identity/session-management.md#prevent-concurrent-login
        /// </summary>
        public const string ConcurrentLoginStrategy = SessionPrefix + ".ConcurrentLoginStrategy";
        /// <summary>
        /// Giới hạn số lượng đăng nhập trên cùng loại thiết bị
        /// </summary>
        public const string LogoutFromSameTypeDevicesLimit = SessionPrefix + ".LogoutFromSameTypeDevicesLimit";
    }

    public static class Security
    {
        private const string SecurityPrefix = Prefix + ".Security";

        public const string TwoFactorBehaviour = SecurityPrefix + ".TwoFactorBehaviour";

        public const string UsersCanChangeTwoFactor = SecurityPrefix + ".UsersCanChangeTwoFactor";

        public const string AdminRoleTwoFactorForceEnabled = SecurityPrefix + ".AdminRoleTwoFactorForceEnabled";

        public const string ProhibitDefaultAdminRole = SecurityPrefix + ".ProhibitDefaultAdminRole";

        public const string UseCaptcha = SecurityPrefix + ".ProhibitDefaultAdminRole";
    }

    public static class SignIn
    {
        private const string SignInPrefix = "Abp.Identity.SignIn";

        public const string RequireCaptchaVerification = SignInPrefix + ".RequireCaptchaVerification";

        public const string CaptchaComponent = SignInPrefix + ".CaptchaComponent";
    }

    public static class Link
    {
        private const string LinkPrefix = Prefix + ".Link";
        /// <summary>
        /// Trang đăng nhập của người dùng (chuỗi địa chỉ đăng nhập bao gồm giao thức, dùng cho liên kết trong email đăng nhập gửi cho người dùng)
        /// </summary>
        public const string UserLoginUri = LinkPrefix + ".UserLoginUri";
    }
}
