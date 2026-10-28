namespace LINGYUN.Abp.WeChat;

public class AbpWeChatGlobalConsts
{
    /// <summary>
    /// Tên ủy quyền WeChat
    /// </summary>
    public static string AuthenticationScheme { get; set; }= "WeChat";
    /// <summary>
    /// Định danh thông tin cá nhân WeChat
    /// </summary>
    public static string ProfileKey { get; set; } = "wechat.profile";
    /// <summary>
    /// Tên tham số Token ủy quyền WeChat
    /// </summary>
    public static string TokenName  { get; set; }= "code";
    /// <summary>
    /// Tên hiển thị ủy quyền WeChat
    /// </summary>
    public static string DisplayName { get; set; } = "WeChat";

    public static string HttpClient { get; set; } = "Abp.WeChat";
}
