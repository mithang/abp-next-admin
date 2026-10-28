namespace LINGYUN.Abp.WeChat.Work.Features;

public static class WeChatWorkFeatureNames
{
    public const string GroupName = "WeChat.Work";
    /// <summary>
    /// Bật WeChat Work doanh nghiệp
    /// </summary>
    public const string Enable = GroupName + ".Enable";

    public static class Message
    {
        public const string GroupName = WeChatWorkFeatureNames.GroupName + ".Message";
        /// <summary>
        /// Bật đẩy tin nhắn
        /// </summary>
        public const string Enable = GroupName + ".Enable";
        /// <summary>
        /// Giới hạn số lần gửi
        /// </summary>
        public const string Limit = GroupName + ".Limit";
        /// <summary>
        /// Thời lượng giới hạn số lần gửi
        /// </summary>
        public const string LimitInterval = GroupName + ".LimitInterval";
    }

    public static class AppChat
    {
        public const string GroupName = WeChatWorkFeatureNames.GroupName + ".AppChat";
        public static class Message
        {
            /// <summary>
            /// Bật đẩy tin nhắn
            /// </summary>
            public const string Enable = GroupName + ".Enable";
            /// <summary>
            /// Giới hạn số lần gửi
            /// </summary>
            public const string Limit = GroupName + ".Limit";
            /// <summary>
            /// Thời lượng giới hạn số lần gửi
            /// </summary>
            public const string LimitInterval = GroupName + ".LimitInterval";
        }
    }

    public static class Webhook
    {
        public const string GroupName = WeChatWorkFeatureNames.GroupName + ".Webhook";
        /// <summary>
        /// Bật đẩy tin nhắn
        /// </summary>
        public const string Enable = GroupName + ".Enable";
        /// <summary>
        /// Giới hạn số lần gửi
        /// </summary>
        public const string Limit = GroupName + ".Limit";
        /// <summary>
        /// Thời lượng giới hạn số lần gửi
        /// </summary>
        public const string LimitInterval = GroupName + ".LimitInterval";
    }
}
