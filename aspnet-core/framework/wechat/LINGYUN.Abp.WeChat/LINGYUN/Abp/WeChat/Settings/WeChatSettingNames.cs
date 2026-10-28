namespace LINGYUN.Abp.WeChat.Settings;

public static class WeChatSettingNames
{
    public const string Prefix = "Abp.WeChat";
    /// <summary>
    /// Bật đăng nhập nhanh
    /// Khi đăng nhập bằng code WeChat, nếu chưa có thông tin người dùng đã đăng ký và cấu hình này được bật, hệ thống sẽ trực tiếp tạo người dùng mới và liên kết openid
    /// </summary>
    public const string EnabledQuickLogin = Prefix + ".EnabledQuickLogin";
}
