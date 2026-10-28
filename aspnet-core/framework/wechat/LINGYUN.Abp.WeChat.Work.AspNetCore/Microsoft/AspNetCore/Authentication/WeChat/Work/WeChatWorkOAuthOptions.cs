using LINGYUN.Abp.WeChat.Work.Security.Claims;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Volo.Abp.Security.Claims;

namespace Microsoft.AspNetCore.Authentication.WeChat.Work;

public class WeChatWorkOAuthOptions : OAuthOptions
{
    /// <summary>
    /// Id doanh nghiệp
    /// </summary>
    public string CorpId { get; set; }
    /// <summary>
    /// Endpoint thông tin nhạy cảm của người dùng
    /// </summary>
    public string UserDetailEndpoint { get; set; }
    public WeChatWorkOAuthOptions()
    {
        // Dùng để ngăn lỗi khởi tạo, sẽ được ghi đè trong OAuthHandler.InitializeHandlerAsync
        CorpId = "CorpId";
        ClientId = "ClientId";
        ClientSecret = "ClientSecret";

        CallbackPath = new PathString(WeChatWorkOAuthConsts.CallbackPath);

        AuthorizationEndpoint = WeChatWorkOAuthConsts.AuthorizationEndpoint;
        TokenEndpoint = WeChatWorkOAuthConsts.TokenEndpoint;
        UserInformationEndpoint = WeChatWorkOAuthConsts.UserInfoEndpoint;
        UserDetailEndpoint = WeChatWorkOAuthConsts.UserDetailEndpoint;


        Scope.Add(WeChatWorkOAuthConsts.LoginScope);
        Scope.Add(WeChatWorkOAuthConsts.UserInfoScope);

        ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "userid");
        ClaimActions.MapJsonKey(ClaimTypes.Name, "userid");
        ClaimActions.MapJsonKey("sub", "userid");

        // Ghi định danh tùy chỉnh vào token
        ClaimActions.MapJsonKey(AbpWeChatWorkClaimTypes.UserId, "userid");
        ClaimActions.MapJsonKey(AbpWeChatWorkClaimTypes.QrCode, "qr_code");
        ClaimActions.MapJsonKey(AbpWeChatWorkClaimTypes.BizMail, "biz_mail");
        ClaimActions.MapJsonKey(AbpWeChatWorkClaimTypes.Address, "address");
        ClaimActions.MapJsonKey(AbpClaimTypes.PhoneNumber, "mobile");
        ClaimActions.MapJsonKey(AbpClaimTypes.Email, "email");
    }
}
