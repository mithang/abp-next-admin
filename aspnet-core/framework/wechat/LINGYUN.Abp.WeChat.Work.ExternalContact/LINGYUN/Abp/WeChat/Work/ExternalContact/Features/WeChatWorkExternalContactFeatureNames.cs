using LINGYUN.Abp.WeChat.Work.Features;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Features;
/// <summary>
/// Tính năng mô-đun liên hệ khách hàng WeChat Work
/// </summary>
public static class WeChatWorkExternalContactFeatureNames
{
    public const string GroupName = WeChatWorkFeatureNames.GroupName + ".ExternalContact";
    /// <summary>
    /// Bật liên hệ khách hàng WeChat Work
    /// </summary>
    public const string Enable = GroupName + ".Enable";
}
