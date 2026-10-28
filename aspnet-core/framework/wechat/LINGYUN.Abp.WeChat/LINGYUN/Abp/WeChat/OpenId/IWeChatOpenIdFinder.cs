using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.OpenId;

public interface IWeChatOpenIdFinder
{
    Task<WeChatOpenId?> FindAsync(string code, string appId, string appSecret);
    /// <summary>
    /// Lấy OpenId của người dùng đang đăng nhập
    /// </summary>
    /// <param name="appId">Định danh ứng dụng</param>
    /// <returns></returns>
    /// <exception cref="Volo.Abp.Authorization.AbpAuthorizationException">Khi người dùng chưa đăng nhập</exception>
    /// <exception cref="Volo.Abp.AbpException">Khi sessionKey của WeChat hết hạn</exception>
    Task<WeChatOpenId?> FindAsync(string appId);
}
