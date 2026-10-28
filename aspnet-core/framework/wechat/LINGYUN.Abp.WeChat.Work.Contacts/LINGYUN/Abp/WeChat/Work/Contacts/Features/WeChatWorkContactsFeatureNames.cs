using LINGYUN.Abp.WeChat.Work.Features;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Features;
/// <summary>
/// Tính năng mô-đun danh bạ WeChat Work
/// </summary>
public static class WeChatWorkContactsFeatureNames
{
    public const string GroupName = WeChatWorkFeatureNames.GroupName + ".Contacts";
    /// <summary>
    /// Bật danh bạ WeChat Work
    /// </summary>
    public const string Enable = GroupName + ".Enable";
}
