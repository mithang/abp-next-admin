namespace LINGYUN.Abp.WeChat.MiniProgram;

public class AbpWeChatMiniProgramConsts
{
    /// <summary>
    /// Tên Provider tương ứng với Mini Program WeChat
    /// </summary>
    public static string ProviderName { get; set; } = "WeChat.MiniProgram";

    /// <summary>
    /// Loại ủy quyền của Mini Program WeChat
    /// </summary>
    public static string GrantType { get; set; } = "wx-mp";

    /// <summary>
    /// Tên phương thức ủy quyền của Mini Program WeChat
    /// </summary>
    public static string AuthenticationMethod { get; set; } = "wma";
    public static string HttpClient { get; set; } = "Abp.WeChat.MiniProgram";
}
