using LINGYUN.Abp.WeChat.Work.Settings;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Settings;

public static class WeChatWorkContactSettingNames
{
    public const string Prefix = WeChatWorkSettingNames.Prefix + ".Contacts";
    /// <summary>
    /// Srcret của ứng dụng Danh bạ
    /// </summary>
    public const string Secret = Prefix + ".Secret";
}
