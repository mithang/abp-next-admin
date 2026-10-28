using LINGYUN.Abp.Authentication.QQ;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Microsoft.AspNetCore.Authentication.QQ;

public class QQConnectOAuthOptions : OAuthOptions
{
    /// <summary>
    /// Có phải kiểu dành cho thiết bị di động hay không
    /// </summary>
    public bool IsMobile { get; set; }
    /// <summary>
    /// Lấy OpenID của người dùng_OAuth2.0
    /// </summary>
    public string OpenIdEndpoint { get; set; }

    public QQConnectOAuthOptions()
    {
        // Dùng để tránh lỗi khởi tạo, sẽ được ghi đè trong OAuthHandler.InitializeHandlerAsync
        ClientId = "QQConnect";
        ClientSecret = "QQConnect";

        ClaimsIssuer = "connect.qq.com";
        CallbackPath = new PathString(AbpAuthenticationQQConsts.CallbackPath);

        AuthorizationEndpoint = "https://graph.qq.com/oauth2.0/authorize";
        TokenEndpoint = "https://graph.qq.com/oauth2.0/token";
        OpenIdEndpoint = "https://graph.qq.com/oauth2.0/me";
        UserInformationEndpoint = "https://graph.qq.com/user/get_user_info";

        Scope.Add("get_user_info");

        // Thuộc tính gốc này bắt buộc phải ghi vào, framework dựa vào đó để xác định có liên kết QQ hay không
        ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "openid");
        ClaimActions.MapJsonKey(ClaimTypes.Name, "nickname");

        // Ghi định danh tùy chỉnh vào token
        ClaimActions.MapJsonKey(AbpQQClaimTypes.OpenId, "openid");
        ClaimActions.MapJsonKey(AbpQQClaimTypes.NickName, "nickname");
        ClaimActions.MapJsonKey(AbpQQClaimTypes.Gender, "gender");
        ClaimActions.MapJsonKey(AbpQQClaimTypes.AvatarUrl, "figureurl_qq_1");
    }
}
