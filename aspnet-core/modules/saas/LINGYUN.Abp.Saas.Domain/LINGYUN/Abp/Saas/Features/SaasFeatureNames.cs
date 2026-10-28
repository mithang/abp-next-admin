namespace LINGYUN.Abp.Saas.Features;
public static class SaasFeatureNames
{
    public const string GroupName = "AbpSaas";

    public static class Tenant
    {
        public const string Default = GroupName + ".Tenants";
        /// <summary>
        /// Chiến lược thu hồi tài nguyên
        /// </summary>
        public const string RecycleStrategy = Default + ".RecycleStrategy";
        /// <summary>
        /// Thời gian thu hồi khi hết hạn
        /// </summary>
        /// <remarks>
        /// Khi tài nguyên sắp hết hạn, cần gửi email thông báo cho quản trị viên bên thuê tương ứng, quá hạn bao lâu mà chưa xử lý sẽ thu hồi tài nguyên của bên thuê
        /// </remarks>
        public const string ExpiredRecoveryTime = Default + ".ExpiredRecoveryTime";
        /// <summary>
        /// Số ngày cảnh báo hết hạn
        /// </summary>
        /// <remarks>
        /// Khi tài nguyên còn bao nhiêu ngày nữa là hết hạn thì gửi nhắc nhở cho quản trị viên
        /// </remarks>
        public const string ExpirationReminderDays = Default + ".ExpirationReminderDays";
    }
}
