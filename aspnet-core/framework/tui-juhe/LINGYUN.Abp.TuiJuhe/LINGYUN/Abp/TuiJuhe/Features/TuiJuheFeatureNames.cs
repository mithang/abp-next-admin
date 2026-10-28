namespace LINGYUN.Abp.TuiJuhe.Features;

public static class TuiJuheFeatureNames
{
    public const string GroupName = "TuiJuhe";

    /// <summary>
    /// Bật TuiJuhe
    /// </summary>
    public const string Enable = GroupName + ".Enable";

    public static class Message
    {
        public const string GroupName = TuiJuheFeatureNames.GroupName + ".Message";
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
