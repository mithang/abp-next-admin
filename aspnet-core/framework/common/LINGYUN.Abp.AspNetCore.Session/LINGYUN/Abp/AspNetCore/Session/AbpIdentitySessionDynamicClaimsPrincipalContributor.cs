using LINGYUN.Abp.Identity.Session;
using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;

namespace LINGYUN.Abp.AspNetCore.Session;

public class AbpIdentitySessionDynamicClaimsPrincipalContributor : IAbpDynamicClaimsPrincipalContributor, ITransientDependency
{
    public async virtual Task ContributeAsync(AbpClaimsPrincipalContributorContext context)
    {
        var claimsIdentity = context.ClaimsPrincipal.Identities.First();
        var sessionId = claimsIdentity.FindSessionId();
        var userId = claimsIdentity.FindUserId();
        if (!userId.HasValue && sessionId.IsNullOrWhiteSpace())
        {
            return;
        }
        var tenantId = claimsIdentity.FindTenantId();
        var currentTenant = context.GetRequiredService<ICurrentTenant>();
        using (currentTenant.Change(tenantId))
        {
            var identitySessionChecker = context.GetRequiredService<IIdentitySessionChecker>();
            if (!await identitySessionChecker.ValidateSessionAsync(context.ClaimsPrincipal))
            {
                // Phiên người dùng đã hết hạn
                context.ClaimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());
            }
        }
    }
}
