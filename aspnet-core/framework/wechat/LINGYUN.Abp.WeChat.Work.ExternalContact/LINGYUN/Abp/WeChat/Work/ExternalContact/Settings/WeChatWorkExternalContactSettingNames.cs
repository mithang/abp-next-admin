using LINGYUN.Abp.WeChat.Work.Settings;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Settings;

public static class WeChatWorkExternalContactSettingNames
{
    public const string Prefix = WeChatWorkSettingNames.Prefix + ".ExternalContact";
    /// <summary>
    /// Srcret của ứng dụng Liên hệ khách hàng
    /// </summary>
    public const string Secret = Prefix + ".Secret";
}
