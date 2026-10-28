using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Volo.Abp.Identity;

namespace LINGYUN.Abp.Gdpr.Identity;

/// <summary>
/// Nhà cung cấp tài khoản người dùng của mô-đun định danh (Identity)
/// </summary>
public class AbpGdprIdentityUserAccountProvider : GdprUserAccountProviderBase
{
    public const string ProviderName = "Identity";

    public override string Name => ProviderName;

    public async override Task DeleteAsync(GdprDeleteUserAccountContext context)
    {
        var identityUserManager = context.ServiceProvider.GetRequiredService<IdentityUserManager>();

        var identityUser = await identityUserManager.GetByIdAsync(context.UserId);

        // Giữ lại tài khoản quản trị viên mặc định
        // TODO: Giữ ở nơi bảo trì thống nhất?
        if (identityUser.UserName != "admin")
        {
            (await identityUserManager.DeleteAsync(identityUser)).CheckErrors();
        }
    }
}
