namespace LINGYUN.Abp.WeChat.Official;

public class AbpWeChatOfficialConsts
{
    /// <summary>
    /// Tên Provider tương ứng với tài khoản công khai WeChat
    /// </summary>
    public static string ProviderName { get; set; } = "WeChat.Official";

    /// <summary>
    /// Loại ủy quyền của nền tảng công khai WeChat
    /// </summary>
    public static string GrantType { get; set; } = "wx-op";

    /// <summary>
    /// Tên phương thức ủy quyền của nền tảng công khai WeChat
    /// </summary>
    public static string AuthenticationMethod { get; set; } = "woa";

    public static string HttpClient { get; set; } = "Abp.WeChat.Official";
}
