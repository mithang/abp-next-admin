using LINGYUN.Abp.WeChat;
using LINGYUN.Abp.WeChat.Official;

namespace LINGYUN.Abp.Authentication.WeChat;

public static class AbpAuthenticationWeChatConsts
{
    /// <summary>
    /// Định danh thông tin cá nhân WeChat
    /// </summary>
    public static string ProfileKey => AbpWeChatGlobalConsts.ProfileKey;
    /// <summary>
    /// Định danh nhà cung cấp WeChat
    /// </summary>
    public static string ProviderKey => AbpWeChatOfficialConsts.ProviderName;
    /// <summary>
    /// Tên hiển thị của nhà cung cấp WeChat
    /// </summary>
    public static string DisplayName => AbpWeChatGlobalConsts.DisplayName;
    /// <summary>
    /// Địa chỉ callback
    /// </summary>
    public static string CallbackPath { get; set; } = "/signin-wechat";

    /// <summary>
    /// Đăng nhập web bên ngoài client WeChat
    /// </summary>
    public const string QrConnectEndpoint = "https://open.weixin.qq.com/connect/qrconnect";

    /// <summary>
    /// Đăng nhập web bên trong client WeChat
    /// </summary>
    public const string AuthorizationEndpoint = "https://open.weixin.qq.com/connect/oauth2/authorize";

    /// <summary>
    /// Địa chỉ dùng code trả về sau khi người dùng cho phép ủy quyền để đổi lấy access_token
    /// </summary>
    public const string TokenEndpoint = "https://api.weixin.qq.com/sns/oauth2/access_token";

    /// <summary>
    /// Địa chỉ dùng access_token để lấy thông tin cá nhân của người dùng
    /// </summary>
    public const string UserInformationEndpoint = "https://api.weixin.qq.com/sns/userinfo";
    /// <summary>
    /// Hiển thị trang ủy quyền, có thể lấy nickname, giới tính, địa phương thông qua openid.
    /// Hơn nữa, ngay cả khi chưa theo dõi, chỉ cần người dùng ủy quyền là có thể lấy được thông tin của họ
    /// <br />
    /// <br />
    /// Xem chi tiết tại: <see cref="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html"/>
    /// </summary>
    /// <remarks>
    /// Ủy quyền web với scope là snsapi_userinfo được dùng để lấy thông tin cơ bản của người dùng.
    /// Tuy nhiên, hình thức ủy quyền này cần người dùng đồng ý thủ công, và vì người dùng đã đồng ý nên không cần theo dõi, sau khi ủy quyền là có thể lấy được thông tin cơ bản của người dùng đó
    /// </remarks>
    public const string UserInfoScope = "snsapi_userinfo";
    /// <summary>
    /// Không hiển thị trang ủy quyền, chuyển hướng trực tiếp, chỉ có thể lấy openid của người dùng
    /// <br />
    /// <br />
    /// Xem chi tiết tại: <see cref="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html"/>
    /// </summary>
    /// <remarks>
    /// Ủy quyền web với scope là snsapi_base được dùng để lấy openid của người dùng truy cập trang, và là ủy quyền im lặng, tự động chuyển hướng đến trang callback.
    /// Người dùng cảm nhận là đi thẳng vào trang callback (thường là trang nghiệp vụ)
    /// </remarks>
    public const string LoginScope = "snsapi_login";
}
