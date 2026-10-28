namespace LINGYUN.Abp.WeChat.Work.Settings;

public static class WeChatWorkSettingNames
{
    public const string Prefix = "Abp.WeChat.Work";

    /// <summary>
    /// Bật đăng nhập nhanh
    /// </summary>
    public const string EnabledQuickLogin = Prefix + ".EnabledQuickLogin";

    public static class Connection
    {
        public const string Prefix = WeChatWorkSettingNames.Prefix + ".Connection";
        /// <summary>
        /// Id doanh nghiệp
        /// </summary>
        public static string CorpId = Prefix + ".CorpId";
        /// <summary>
        /// Id ứng dụng
        /// </summary>
        public static string AgentId = Prefix + ".AgentId";
        /// <summary>
        /// Khóa bí mật ứng dụng
        /// </summary>
        public static string Secret = Prefix + ".Secret";
        /// <summary>
        /// Token
        /// </summary>
        public static string Token = Prefix + ".Token";
        /// <summary>
        /// EncodingAESKey
        /// </summary>
        public static string EncodingAESKey = Prefix + ".EncodingAESKey";
    }
}
