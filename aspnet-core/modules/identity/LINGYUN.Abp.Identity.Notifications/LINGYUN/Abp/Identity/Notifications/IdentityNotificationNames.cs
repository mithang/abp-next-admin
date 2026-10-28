namespace LINGYUN.Abp.Identity.Notifications;
public static class IdentityNotificationNames
{
    public const string GroupName = "AbpIdentity";

    public static class Session
    {
        public const string Prefix = GroupName + ".Session";
        /// <summary>
        /// Thông báo hết hạn phiên
        /// </summary>
        public const string ExpirationSession = Prefix + ".Expiration";
    }

    public static class IdentityUser
    {
        public const string Prefix = GroupName + ".IdentityUser";
        /// <summary>
        /// Thông báo tài khoản vẫn đang hoạt động
        /// </summary>
        public const string InactiveUserReminderNotifier = Prefix + ".InactiveUserReminderNotifier";
        /// <summary>
        /// Thông báo vô hiệu hoá tài khoản
        /// </summary>
        public const string InactiveUserDeactivationNotifier = Prefix + ".InactiveUserDeactivationNotifier";
        /// <summary>
        /// Thông báo xoá tài khoản
        /// </summary>
        public const string InactiveUserDeletionNotifier = Prefix + ".InactiveUserDeletionNotifier";
    }
}
