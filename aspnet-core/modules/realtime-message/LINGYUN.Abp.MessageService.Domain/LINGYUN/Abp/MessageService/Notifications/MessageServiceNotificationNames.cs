namespace LINGYUN.Abp.MessageService.Notifications;

public static class MessageServiceNotificationNames
{
    public const string GroupName = "LINGYUN.Abp.Messages";

    public class IM
    {
        public const string GroupName = MessageServiceNotificationNames.GroupName + ".IM";
        /// <summary>
        /// Thông báo xác minh bạn bè
        /// </summary>
        public const string FriendValidation = GroupName + ".FriendValidation";
        /// <summary>
        /// Thông báo bạn bè mới
        /// </summary>
        public const string NewFriend = GroupName + ".NewFriend";
        /// <summary>
        /// Thông báo tham gia nhóm
        /// </summary>
        public const string JoinGroup = GroupName + ".JoinGroup";
        /// <summary>
        /// Thông báo rời nhóm
        /// </summary>
        public const string ExitGroup = GroupName + ".ExitGroup";
        /// <summary>
        /// Thông báo giải tán nhóm
        /// </summary>
        public const string DissolveGroup = GroupName + ".DissolveGroup";
    }

}
