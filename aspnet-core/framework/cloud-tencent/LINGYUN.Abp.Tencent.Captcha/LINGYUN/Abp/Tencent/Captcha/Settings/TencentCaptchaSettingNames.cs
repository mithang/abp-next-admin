using LINGYUN.Abp.Tencent.Settings;

namespace LINGYUN.Abp.Tencent.Captcha.Settings;

public static class TencentCaptchaSettingNames
{
    private const string Prefix = TencentCloudSettingNames.Prefix + ".Captcha";
    /// <summary>
    /// ID nghiệp vụ mã xác minh
    /// </summary>
    public const string CaptchaAppId = Prefix + ".CaptchaAppId";
    /// <summary>
    /// Khóa bí mật gốc
    /// </summary>
    public const string AppSecretKey = Prefix + ".AppSecretKey";
    /// <summary>
    /// Phương thức mã hóa
    /// </summary>
    public const string CaptchaAppIdEncryptedType = Prefix + ".CaptchaAppIdEncryptedType";
    /// <summary>
    /// Thời gian hết hạn (giây), tối đa 86400 giây
    /// </summary>
    public const string CaptchaAppIdEncryptedExpireTime = Prefix + ".CaptchaAppIdEncryptedExpireTime";
}
