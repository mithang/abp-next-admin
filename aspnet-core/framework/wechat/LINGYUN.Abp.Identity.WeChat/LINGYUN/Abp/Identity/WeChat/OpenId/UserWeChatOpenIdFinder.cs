using LINGYUN.Abp.WeChat.OpenId;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;

namespace LINGYUN.Abp.Identity.WeChat.OpenId;

[Dependency(ServiceLifetime.Transient, ReplaceServices = true)]
[ExposeServices(typeof(IUserWeChatOpenIdFinder))]
public class UserWeChatOpenIdFinder : IUserWeChatOpenIdFinder
{
    protected IdentityUserManager UserManager { get; }

    public UserWeChatOpenIdFinder(
        IdentityUserManager userManager)
    {
        UserManager = userManager;
    }

    public async virtual Task<string?> FindByUserIdAsync(Guid userId, string provider)
    {
        var user = await UserManager.FindByIdAsync(userId.ToString());

        return GetUserOpenIdOrNull(user, provider);
    }

    public async virtual Task<string?> FindByUserNameAsync(string userName, string provider)
    {
        var user = await UserManager.FindByNameAsync(userName);

        return GetUserOpenIdOrNull(user, provider);
    }

    protected string? GetUserOpenIdOrNull(IdentityUser? user, string provider)
    {
        // Sau khi đăng nhập mở rộng WeChat, openid được lưu trong Login
        var userLogin = user?.Logins
            .Where(login => login.LoginProvider == provider)
            .FirstOrDefault();

        return userLogin?.ProviderKey;
    }
}
