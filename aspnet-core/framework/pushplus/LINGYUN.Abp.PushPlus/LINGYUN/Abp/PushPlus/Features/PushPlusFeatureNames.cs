namespace LINGYUN.Abp.PushPlus.Features;

public static class PushPlusFeatureNames
{
    public const string GroupName = "PushPlus";

    public static class Message
    {
        public const string GroupName = PushPlusFeatureNames.GroupName + ".Message";

        public const string Enable = GroupName + ".Enable";
    }

    public static class Channel
    {
        public const string GroupName = PushPlusFeatureNames.GroupName + ".Channel";

        public static class WeChat
        {
            public const string GroupName = Channel.GroupName + ".WeChat";
            /// <summary>
            /// Bật kênh WeChat
            /// </summary>
            public const string Enable = GroupName + ".Enable";
            /// <summary>
            /// Giới hạn số lần gửi
            /// </summary>
            public const string SendLimit = GroupName + ".SendLimit";
            /// <summary>
            /// Thời lượng áp dụng giới hạn số lần gửi
            /// </summary>
            public const string SendLimitInterval = GroupName + ".SendLimitInterval";
        }

        public static class WeWork
        {
            public const string GroupName = Channel.GroupName + ".WeWork";
            /// <summary>
            /// Bật kênh WeChat doanh nghiệp
            /// </summary>
            public const string Enable = GroupName + ".Enable";
            /// <summary>
            /// Giới hạn số lần gửi
            /// </summary>
            public const string SendLimit = GroupName + ".SendLimit";
            /// <summary>
            /// Thời lượng áp dụng giới hạn số lần gửi
            /// </summary>
            public const string SendLimitInterval = GroupName + ".SendLimitInterval";
        }

        public static class Webhook
        {
            public const string GroupName = Channel.GroupName + ".Webhook";
            /// <summary>
            /// Bật kênh Webhook
            /// </summary>
            public const string Enable = GroupName + ".Enable";
            /// <summary>
            /// Giới hạn số lần gửi
            /// </summary>
            public const string SendLimit = GroupName + ".SendLimit";
            /// <summary>
            /// Thời lượng áp dụng giới hạn số lần gửi
            /// </summary>
            public const string SendLimitInterval = GroupName + ".SendLimitInterval";
        }

        public static class Email
        {
            public const string GroupName = Channel.GroupName + ".Email";
            /// <summary>
            /// Bật kênh Email
            /// </summary>
            public const string Enable = GroupName + ".Enable";
            /// <summary>
            /// Giới hạn số lần gửi
            /// </summary>
            public const string SendLimit = GroupName + ".SendLimit";
            /// <summary>
            /// Thời lượng áp dụng giới hạn số lần gửi
            /// </summary>
            public const string SendLimitInterval = GroupName + ".SendLimitInterval";
        }

        public static class Sms
        {
            public const string GroupName = Channel.GroupName + ".Sms";
            /// <summary>
            /// Bật kênh SMS
            /// </summary>
            public const string Enable = GroupName + ".Enable";
            /// <summary>
            /// Giới hạn số lần gửi
            /// </summary>
            public const string SendLimit = GroupName + ".SendLimit";
            /// <summary>
            /// Thời lượng áp dụng giới hạn số lần gửi
            /// </summary>
            public const string SendLimitInterval = GroupName + ".SendLimitInterval";
        }
    }
}
