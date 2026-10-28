using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;

namespace LINGYUN.Abp.Identity.Session;

public class DefaultIdentitySessionChecker : IIdentitySessionChecker, ITransientDependency
{
    public ILogger<DefaultIdentitySessionChecker> Logger { protected get; set; }

    protected IClock Clock { get; }
    protected ICurrentTenant CurrentTenant { get; }
    protected IDeviceInfoProvider DeviceInfoProvider { get; }
    protected IDistributedEventBus DistributedEventBus { get; }
    protected IIdentitySessionCache IdentitySessionCache { get; }
    protected IdentitySessionCheckOptions SessionCheckOptions { get; }

    public DefaultIdentitySessionChecker(
        IClock clock, 
        ICurrentTenant currentTenant, 
        IDeviceInfoProvider deviceInfoProvider,
        IDistributedEventBus distributedEventBus,
        IIdentitySessionCache identitySessionCache,
        IOptions<IdentitySessionCheckOptions> sessionCheckOptions)
    {
        Clock = clock;
        CurrentTenant = currentTenant;
        DeviceInfoProvider = deviceInfoProvider;
        DistributedEventBus = distributedEventBus;
        IdentitySessionCache = identitySessionCache;
        SessionCheckOptions = sessionCheckOptions.Value;

        Logger = NullLogger<DefaultIdentitySessionChecker>.Instance;
    }

    public async virtual Task<bool> ValidateSessionAsync(ClaimsPrincipal claimsPrincipal, CancellationToken cancellationToken = default)
    {
        var userId = claimsPrincipal.FindImpersonatorUserId() ?? claimsPrincipal.FindUserId();
        var sessionId = claimsPrincipal.FindSessionId();
        if (!userId.HasValue || sessionId.IsNullOrWhiteSpace())
        {
            Logger.LogDebug("No user session id found.");
            return false;
        }

        var identitySessionCacheItem = await IdentitySessionCache.GetAsync(sessionId, cancellationToken);
        if (identitySessionCacheItem == null)
        {
            Logger.LogDebug("No user session cache found for: {sessionId}.", sessionId);
            return false;
        }
        if (identitySessionCacheItem.UserId != userId.Value)
        {
            Logger.LogWarning("User session does not match. There might be a forged token. User ID: {userId}, Session ID: {sessionId}",
                userId, sessionId);
            Logger.LogWarning("The session is insecure and the leaked tokens have been forcibly cleared.");
            await IdentitySessionCache.RemoveAsync(sessionId, cancellationToken);
            return false;
        }

        // Implementation https://github.com/abpio/abp-commercial-docs/blob/dev/en/modules/identity/session-management.md#how-it-works

        var lastAccessedTime = identitySessionCacheItem.LastAccessed;
        var accressedTime = Clock.Now;

        if (lastAccessedTime.HasValue &&
            lastAccessedTime.Value < accressedTime.Subtract(SessionCheckOptions.KeepAccessTimeSpan))
        {
            // Cập nhật địa chỉ truy cập và địa chỉ IP máy khách trong bộ nhớ đệm
            identitySessionCacheItem.LastAccessed = accressedTime;
            identitySessionCacheItem.IpAddresses = DeviceInfoProvider.ClientIpAddress;

            // TODO: Tạm thời gỡ bỏ, nếu không token làm mới sẽ không còn hiệu lực
            // 2024-10-10 Lấy thời gian ban hành và thời gian hết hạn từ token để tính dấu thời gian, dùng làm thời gian hết hạn mặc định của bộ nhớ đệm
            //var expirainTime = claimsPrincipal.FindExpirainTime();
            //var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            //if (expirainTime.HasValue)
            //{
            //    // 2024-10-25 Nên tính thời gian hết hạn còn lại
            //    identitySessionCacheItem.ExpiraIn = (expirainTime.Value - timestamp) * 1000;
            //}

            Logger.LogDebug("Refresh the user access info in the cache from {sessionId}.", sessionId);
            await IdentitySessionCache.RefreshAsync(sessionId, identitySessionCacheItem, cancellationToken);
        }

        // Tránh việc làm mới cơ sở lưu trữ bền vững quá thường xuyên trong một số trường hợp
        if (lastAccessedTime.HasValue &&
            lastAccessedTime.Value < accressedTime.Subtract(SessionCheckOptions.SessionSyncTimeSpan))
        {
            Logger.LogDebug("Publishes the cache synchronization user session event from {sessionId}.", sessionId);
            // Phát hành sự kiện để cơ sở lưu trữ bền vững đồng bộ từ bộ nhớ đệm
            var eventData = new IdentitySessionChangeAccessedEvent(
                identitySessionCacheItem.SessionId,
                identitySessionCacheItem.IpAddresses,
                accressedTime,
                CurrentTenant.Id);

            await DistributedEventBus.PublishAsync(eventData);
        }

        return true;
    }
}
