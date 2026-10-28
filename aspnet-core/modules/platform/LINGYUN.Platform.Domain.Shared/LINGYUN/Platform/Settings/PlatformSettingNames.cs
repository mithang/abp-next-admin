namespace LINGYUN.Platform.Settings;

public class PlatformSettingNames
{
    public const string GroupName = "AppPlatform";

    public class AppVersion
    {
        public const string Default = GroupName + ".AppVersion";
        /// <summary>
        /// Độ dài giới hạn của tệp
        /// </summary>
        public const string VersionFileLimitLength = Default + ".VersionFileLimitLength";
        /// <summary>
        /// Loại phần mở rộng tệp được phép
        /// </summary>
        public const string AllowVersionFileExtensions = Default + ".AllowVersionFileExtensions";
    }
}
