namespace LINGYUN.Abp.MessageService.Settings;

public class MessageServiceSettingNames
{
    public const string GroupName = "Abp.MessageService";

    public class Notifications
    {
        public const string Default = GroupName + ".Notifications";
        /// <summary>
        /// Lô dọn dẹp tin nhắn hết hạn
        /// </summary>
        public const string CleanupExpirationBatchCount = Default + ".CleanupExpirationBatchCount";
    }

    public class Messages
    {
        public const string Default = GroupName + ".Messages";
        /// <summary>
        /// Thời gian hết hạn thu hồi tin nhắn (phút)
        /// </summary>
        public const string RecallExpirationTime = Default + ".RecallExpirationTime";
    }
}
