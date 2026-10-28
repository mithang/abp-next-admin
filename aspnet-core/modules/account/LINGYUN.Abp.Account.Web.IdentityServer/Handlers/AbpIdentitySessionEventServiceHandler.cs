//using IdentityServer4.Events;
//using LINGYUN.Abp.Identity.Session;
//using System;
//using System.Security.Claims;
//using System.Threading.Tasks;
//using Volo.Abp.DependencyInjection;
//using Volo.Abp.MultiTenancy;
//using Volo.Abp.Security.Claims;
//using Volo.Abp.Uow;

//namespace LINGYUN.Abp.IdentityServer.Session;
///// <summary>
///// Lưu trữ phiên người dùng
///// </summary>
//public class AbpIdentitySessionEventServiceHandler : IAbpIdentityServerEventServiceHandler, ITransientDependency
//{
//    protected ICurrentTenant CurrentTenant { get; }
//    protected ISessionInfoProvider SessionInfoProvider { get; }
//    protected IIdentitySessionManager IdentitySessionManager { get; }
//    protected ICurrentPrincipalAccessor CurrentPrincipalAccessor { get; }

//    public AbpIdentitySessionEventServiceHandler(
//        ICurrentTenant currentTenant,
//        ISessionInfoProvider sessionInfoProvider,
//        IIdentitySessionManager identitySessionManager,
//        ICurrentPrincipalAccessor currentPrincipalAccessor)
//    {
//        CurrentTenant = currentTenant;
//        SessionInfoProvider = sessionInfoProvider;
//        IdentitySessionManager = identitySessionManager;
//        CurrentPrincipalAccessor = currentPrincipalAccessor;
//    }

//    public virtual bool CanRaiseEventType(EventTypes evtType)
//    {
//        return evtType == EventTypes.Success;
//    }

//    [UnitOfWork]
//    public virtual Task RaiseAsync(Event evt)
//    {
//        if (evt is UserLoginSuccessEvent loginEvent)
//        {
//            // Sự kiện đăng nhập người dùng
//            return RaiseUserLoginSuccessEventAsync(loginEvent);
//        }
//        if (evt is UserLogoutSuccessEvent logoutEvent)
//        {
//            // Sự kiện đăng xuất người dùng
//            return RaiseUserLogoutSuccessEventAsync(logoutEvent);
//        }
//        if (evt is TokenRevokedSuccessEvent revokeEvent)
//        {
//            // Sự kiện thu hồi token
//            return RaiseTokenRevokedSuccessEventAsync(revokeEvent);
//        }
//        return Task.CompletedTask;
//    }

//    protected async virtual Task RaiseUserLoginSuccessEventAsync(UserLoginSuccessEvent loginEvent)
//    {
//        var subjectId = loginEvent.SubjectId;
//        var sessionId = SessionInfoProvider.SessionId;
//        if (!sessionId.IsNullOrWhiteSpace() &&
//            Guid.TryParse(subjectId, out var userId))
//        {
//            var claimsIdentity = new ClaimsIdentity();
//            claimsIdentity.AddClaim(new Claim(AbpClaimTypes.UserId, userId.ToString()));
//            claimsIdentity.AddClaim(new Claim(AbpClaimTypes.SessionId, sessionId));
//            if (!loginEvent.ClientId.IsNullOrWhiteSpace())
//            {
//                claimsIdentity.AddClaim(new Claim(AbpClaimTypes.ClientId, loginEvent.ClientId));
//            }
//            if (CurrentTenant.IsAvailable)
//            {
//                claimsIdentity.AddClaim(new Claim(AbpClaimTypes.TenantId, CurrentTenant.Id!.Value.ToString()));
//            }
//            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
//            using (CurrentPrincipalAccessor.Change(claimsPrincipal))
//            {
//                await IdentitySessionManager.SaveSessionAsync(claimsPrincipal);
//            }
//        }
//    }
//    protected async virtual Task RaiseUserLogoutSuccessEventAsync(UserLogoutSuccessEvent logoutEvent)
//    {
//        var sessionId = SessionInfoProvider.SessionId;
//        if (!sessionId.IsNullOrWhiteSpace())
//        {
//            await IdentitySessionManager.RevokeSessionAsync(sessionId);
//        }
//    }

//    protected async virtual Task RaiseTokenRevokedSuccessEventAsync(TokenRevokedSuccessEvent revokeEvent)
//    {
//        var sessionId = SessionInfoProvider.SessionId;
//        if (!sessionId.IsNullOrWhiteSpace())
//        {
//            await IdentitySessionManager.RevokeSessionAsync(sessionId);
//        }
//    }
//}
