namespace LINGYUN.Abp.WxPusher.Features;

public static class WxPusherFeatureNames
{
    public const string GroupName = "WxPusher";

    /// <summary>
    /// Bật WxPusher
    /// </summary>
    public const string Enable = GroupName + ".Enable";

    public static class Message
    {
        public const string GroupName = WxPusherFeatureNames.GroupName + ".Message";
        /// <summary>
        /// Bật đẩy tin nhắn
        /// </summary>
        public const string Enable = GroupName + ".Enable";
        /// <summary>
        /// Giới hạn số lần gửi
        /// </summary>
        public const string SendLimit = GroupName + ".SendLimit";
        /// <summary>
        /// Thời lượng giới hạn số lần gửi
        /// </summary>
        public const string SendLimitInterval = GroupName + ".SendLimitInterval";
    }
}
