namespace LINGYUN.Abp.Account.OAuth.Features;

public static class AccountOAuthFeatureNames
{
    public const string GroupName = "Abp.Account.OAuth";
    public static class GitHub
    {
        public const string Prefix = GroupName + ".GitHub";
        /// <summary>
        /// Bật đăng nhập xác thực Github
        /// </summary>
        public const string Enable = Prefix + ".Enable";
    }
    public static class QQ
    {
        public const string Prefix = GroupName + ".QQ";
        /// <summary>
        /// Bật đăng nhập xác thực QQ
        /// </summary>
        public const string Enable = Prefix + ".Enable";
    }
    public static class WeChat
    {
        public const string Prefix = GroupName + ".WeChat";
        /// <summary>
        /// Bật đăng nhập xác thực WeChat
        /// </summary>
        public const string Enable = Prefix + ".Enable";
    }
    public static class WeCom
    {
        public const string Prefix = GroupName + ".WeCom";
        /// <summary>
        /// Bật đăng nhập xác thực WeChat doanh nghiệp
        /// </summary>
        public const string Enable = Prefix + ".Enable";
    }
    public static class Bilibili
    {
        public const string Prefix = GroupName + ".Bilibili";
        /// <summary>
        /// Bật đăng nhập xác thực Bilibili
        /// </summary>
        public const string Enable = Prefix + ".Enable";
    }
}
