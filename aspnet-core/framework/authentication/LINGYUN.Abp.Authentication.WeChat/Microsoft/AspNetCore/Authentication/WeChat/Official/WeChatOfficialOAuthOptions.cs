using LINGYUN.Abp.Authentication.WeChat;
using LINGYUN.Abp.WeChat.Common.Security.Claims;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Text.Json;

namespace Microsoft.AspNetCore.Authentication.WeChat.Official;

public class WeChatOfficialOAuthOptions : OAuthOptions
{
    public WeChatOfficialOAuthOptions()
    {
        // Dùng để tránh lỗi khởi tạo, sẽ được ghi đè trong OAuthHandler.InitializeHandlerAsync
        ClientId = "WeChatOfficial";
        ClientSecret = "WeChatOfficial";

        ClaimsIssuer = AbpAuthenticationWeChatConsts.ProviderKey;
        CallbackPath = new PathString(AbpAuthenticationWeChatConsts.CallbackPath);

        AuthorizationEndpoint = AbpAuthenticationWeChatConsts.AuthorizationEndpoint;
        TokenEndpoint = AbpAuthenticationWeChatConsts.TokenEndpoint;
        UserInformationEndpoint = AbpAuthenticationWeChatConsts.UserInformationEndpoint;

        Scope.Add(AbpAuthenticationWeChatConsts.LoginScope);
        Scope.Add(AbpAuthenticationWeChatConsts.UserInfoScope);

        // Thuộc tính gốc này bắt buộc phải ghi vào, framework dùng nó để liên kết với UserLogin.ProviderKey và xác định có liên kết WeChat hay không
        ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "openid");
        ClaimActions.MapJsonKey(ClaimTypes.Name, "nickname");

        // Ghi định danh tùy chỉnh vào token
        ClaimActions.MapJsonKey(AbpWeChatClaimTypes.OpenId, "openid");
        ClaimActions.MapJsonKey(AbpWeChatClaimTypes.UnionId, "unionid");// Nếu tài khoản chính thức liên kết với chương trình mini thì cái này dùng được
        ClaimActions.MapJsonKey(AbpWeChatClaimTypes.NickName, "nickname");
        ClaimActions.MapJsonKey(AbpWeChatClaimTypes.Sex, "sex", ClaimValueTypes.Integer);
        ClaimActions.MapJsonKey(AbpWeChatClaimTypes.Country, "country");
        ClaimActions.MapJsonKey(AbpWeChatClaimTypes.Province, "province");
        ClaimActions.MapJsonKey(AbpWeChatClaimTypes.City, "city");
        ClaimActions.MapJsonKey(AbpWeChatClaimTypes.AvatarUrl, "headimgurl");
        ClaimActions.MapCustomJson(AbpWeChatClaimTypes.Privilege, user =>
        {
            return string.Join(",", user.GetStrings("privilege"));
        });
    }
}
