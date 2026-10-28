namespace LINGYUN.Abp.Aliyun.Features;
public static class AliyunFeatureNames
{
    public const string GroupName = "AlibabaCloud";

    public const string IsEnabled = GroupName + ".IsEnabled";

    public static class Sms
    {
        public const string Default = GroupName + ".Sms";

        public const string IsEnabled = Default + ".IsEnabled";

        /// <summary>
        /// Giới hạn số lần gửi
        /// </summary>
        public const string SendLimit = Default + ".SendLimit";
        /// <summary>
        /// Thời lượng giới hạn số lần gửi
        /// </summary>
        public const string SendLimitInterval = Default + ".SendLimitInterval";
        /// <summary>
        /// Giới hạn số lần gửi mặc định
        /// </summary>
        public const int DefaultSendLimit = 1000;
        /// <summary>
        /// Thời lượng giới hạn số lần gửi mặc định
        /// </summary>
        public const int DefaultSendLimitInterval = 1;
    }

    public static class Oss
    {
        public const string Default = GroupName + ".Sms";

        public const string IsEnabled = GroupName + ".IsEnabled";
    }
}