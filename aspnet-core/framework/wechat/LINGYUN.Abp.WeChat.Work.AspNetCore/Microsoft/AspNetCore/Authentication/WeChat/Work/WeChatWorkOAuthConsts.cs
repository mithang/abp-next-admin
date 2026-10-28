using LINGYUN.Abp.WeChat.Work;

namespace Microsoft.AspNetCore.Authentication.WeChat.Work;

public static class WeChatWorkOAuthConsts
{
    /// <summary>
    /// Tên ủy quyền WeChat Doanh nghiệp
    /// </summary>
    public static string AuthenticationScheme => AbpWeChatWorkGlobalConsts.ProviderName;
    /// <summary>
    /// Tên hiển thị nhà cung cấp WeChat
    /// </summary>
    public static string DisplayName => AbpWeChatWorkGlobalConsts.DisplayName;
    /// <summary>
    /// Địa chỉ callback
    /// </summary>
    public static string CallbackPath { get; set; } = "/signin-wxwork";
    /// <summary>
    /// Đăng nhập web trong ứng dụng khách WeChat
    /// </summary>
    public const string AuthorizationEndpoint = "https://open.weixin.qq.com/connect/oauth2/authorize";
    /// <summary>
    /// Đăng nhập Web
    /// </summary>
    public const string AuthorizationSsoEndpoint = "https://login.work.weixin.qq.com/wwlogin/sso/login";
    /// <summary>
    /// Địa chỉ đổi access_token bằng code trả về sau khi người dùng cho phép ủy quyền
    /// </summary>
    public const string TokenEndpoint = "https://qyapi.weixin.qq.com/cgi-bin/gettoken";

    /// <summary>
    /// Địa chỉ lấy thông tin cá nhân người dùng bằng access_token
    /// </summary>
    public const string UserInfoEndpoint = "https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo";
    /// <summary>
    /// Địa chỉ lấy thông tin nhạy cảm người dùng bằng access_token
    /// </summary>
    public const string UserDetailEndpoint = "https://qyapi.weixin.qq.com/cgi-bin/auth/getuserdetail";

    public const string UserInfoScope = "snsapi_privateinfo";

    public const string LoginScope = "snsapi_base";
}
