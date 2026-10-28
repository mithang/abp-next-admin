using LINGYUN.Abp.WeChat.Work.Features;

namespace LINGYUN.Abp.WeChat.Work.OA.Features;
/// <summary>
/// Tính năng mô-đun văn phòng WeChat Work
/// </summary>
public static class WeChatWorkOAFeatureNames
{
    public const string GroupName = WeChatWorkFeatureNames.GroupName + ".OA";
    /// <summary>
    /// Bật văn phòng WeChat Work
    /// </summary>
    public const string Enable = GroupName + ".Enable";
}
