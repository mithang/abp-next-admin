using LINGYUN.Abp.Aliyun.Settings;

namespace LINGYUN.Abp.Aliyun.Captcha.Settings;

public static class AliyunCaptchaSettingNames
{
    public const string CaptchaPrefix = AliyunSettingNames.Prefix + ".Captcha";
    /// <summary>
    /// Định danh duy nhất của kịch bản mã xác thực
    /// </summary>
    public const string SceneId = CaptchaPrefix + ".SceneId";
    /// <summary>
    /// Định danh lấy từ console
    /// </summary>
    public const string Prefix = CaptchaPrefix + ".Prefix";
    /// <summary>
    /// ekey lấy từ console
    /// </summary>
    public const string EKey = CaptchaPrefix + ".EKey";
    /// <summary>
    /// Định danh kịch bản mã xác thực đã mã hóa
    /// </summary>
    public const string UseEncryptedSceneId = CaptchaPrefix + ".UseEncryptedSceneId";
    /// <summary>
    /// Thời gian hết hạn của bản mã, đơn vị giây, phạm vi 1~86400
    /// </summary>
    public const string EncryptedExpireTimeSec = CaptchaPrefix + ".EncryptedExpireTimeSec";
}
