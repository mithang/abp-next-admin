using LINGYUN.Abp.WeChat.Features;

namespace LINGYUN.Abp.WeChat.MiniProgram.Features;

public static class WeChatMiniProgramFeatures
{
    public const string GroupName = WeChatFeatures.GroupName + ".MiniProgram";

    public const string Enable = GroupName + ".Enable";

    public const string EnableAuthorization = GroupName + ".EnableAuthorization";

    public static class Messages
    {
        public const string Default = GroupName + ".Messages";

        public const string Enable = Default + ".Enable";
        /// <summary>
        /// Giới hạn số lần gửi
        /// </summary>
        public const string SendLimit = Default + ".SendLimit";
        /// <summary>
        /// Thời lượng giới hạn số lần gửi
        /// </summary>
        public const string SendLimitInterval = Default + ".SendLimitInterval";
        /// <summary>
        /// Giới hạn số lần phát hành mặc định
        /// </summary>
        public const int DefaultSendLimit = 1000;
        /// <summary>
        /// Thời lượng giới hạn số lần phát hành mặc định
        /// </summary>
        public const int DefaultSendLimitInterval = 1;
    }
}
