using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.ChangeTracking;
using Volo.Abp.Gdpr;
using Volo.Abp.Identity;
using Volo.Abp.Users;

namespace LINGYUN.Abp.Gdpr.Identity;

/// <summary>
/// Nhà cung cấp dữ liệu người dùng của module định danh
/// </summary>
public class AbpGdprIdentityUserDataProvider: GdprUserDataProviderBase
{
    public const string ProviderName = "Identity";

    public override string Name => ProviderName;

    public async override Task DeleteAsync(GdprDeleteUserDataContext context)
    {
        var identityUserManager = context.ServiceProvider.GetRequiredService<IdentityUserManager>();

        var identityUser = await identityUserManager.GetByIdAsync(context.UserId);

        identityUser.Name = "";
        identityUser.Surname = "";

        // TODO: Nên đặt thành chuỗi rỗng, nhưng framework ABP không cho phép Email rỗng
        (await identityUserManager.SetEmailAsync(identityUser, $"{identityUser.UserName}@abp.io")).CheckErrors();
        (await identityUserManager.SetPhoneNumberAsync(identityUser, "")).CheckErrors();

        // Dọn dẹp định danh
        var userClaims = await identityUserManager.GetClaimsAsync(identityUser);
        (await identityUserManager.RemoveClaimsAsync(identityUser, userClaims)).CheckErrors();

        // TODO: Có cần dọn dẹp tài khoản liên kết bên thứ ba không?
        //var userLogins = await identityUserManager.GetLoginsAsync(identityUser);
        //foreach (var userLogin in userLogins)
        //{
        //    (await identityUserManager.RemoveLoginAsync(identityUser, userLogin.LoginProvider, userLogin.ProviderKey)).CheckErrors();
        //}

        (await identityUserManager.UpdateAsync(identityUser)).CheckErrors();
    }

    [DisableEntityChangeTracking]
    public async override Task PorepareAsync(GdprPrepareUserDataContext context)
    {
        var identityUserManager = context.ServiceProvider.GetRequiredService<IdentityUserManager>();
        var identityUser = await identityUserManager.GetByIdAsync(context.UserId);

        var gdprDataInfo = new GdprDataInfo
        {
            { nameof(UserData.UserName), identityUser.UserName },
            { nameof(UserData.Name), identityUser.Name },
            { nameof(UserData.Surname), identityUser.Surname },
            { nameof(UserData.Email), identityUser.Email },
            { nameof(UserData.PhoneNumber), identityUser.PhoneNumber },
            { nameof(IHasCreationTime.CreationTime), identityUser.CreationTime.ToString("yyyy-MM-dd HH:mm:ss") },
        };

        foreach (var identityUserClaim in identityUser.Claims)
        {
            gdprDataInfo.Add(identityUserClaim.ClaimType, identityUserClaim.ClaimValue);
        }

        await DispatchPrepareUserDataAsync(context, gdprDataInfo);
    }
}
