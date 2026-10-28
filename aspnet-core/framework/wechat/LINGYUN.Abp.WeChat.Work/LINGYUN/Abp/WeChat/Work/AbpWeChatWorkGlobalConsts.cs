namespace LINGYUN.Abp.WeChat.Work;

public class AbpWeChatWorkGlobalConsts
{
    /// <summary>
    ///  Tên Provider tương ứng với WeChat Doanh nghiệp
    /// </summary>
    public static string ProviderName { get; set; } = "WorkWeixin";
    /// <summary>
    /// Loại ủy quyền OAuth của WeChat Doanh nghiệp
    /// </summary>
    public static string OAuthGrantType { get; set; } = "wecom_oauth";
    /// <summary>
    /// Loại ủy quyền mini-program của WeChat Doanh nghiệp
    /// </summary>
    public static string MiniProgramGrantType { get; set; } = "wecom_mp";
    /// <summary>
    /// Định danh thông tin cá nhân của WeChat Doanh nghiệp
    /// </summary>
    public static string ProfileKey { get; set; } = "wecom.profile";
    /// <summary>
    /// Tham số định danh ứng dụng được ủy quyền của WeChat Doanh nghiệp
    /// </summary>
    public static string AgentId { get; set; } = "agent_id";
    /// <summary>
    /// Tham số Code ủy quyền của WeChat Doanh nghiệp
    /// </summary>
    public static string Code  { get; set; }= "code";
    /// <summary>
    /// Tên hiển thị ủy quyền của WeChat Doanh nghiệp
    /// </summary>
    public static string DisplayName { get; set; } = "WeChat Doanh nghiệp";
    /// <summary>
    ///Tên phương thức ủy quyền của WeChat Doanh nghiệp
    /// </summary>
    public static string AuthenticationMethod { get; set; } = "wecom";

    internal static string ApiClient { get; set; } = "Abp.WeChat.Work";
    internal static string OAuthClient { get; set; } = "Abp.WeChat.Work.OAuth";
    internal static string LoginClient { get; set; } = "Abp.WeChat.Work.Login";
}
