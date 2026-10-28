using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Threading;

namespace LINGYUN.Abp.Notifications;

public abstract class NotificationPublishProvider : INotificationPublishProvider, ITransientDependency
{
    public abstract string Name { get; }

    public IAbpLazyServiceProvider ServiceProvider { protected get; set; } = default!;

    public ILoggerFactory LoggerFactory => ServiceProvider.LazyGetRequiredService<ILoggerFactory>();

    protected ILogger Logger => _lazyLogger.Value;
    private Lazy<ILogger> _lazyLogger => new Lazy<ILogger>(() => LoggerFactory?.CreateLogger(GetType().FullName!) ?? NullLogger.Instance, true);

    public ICancellationTokenProvider CancellationTokenProvider => ServiceProvider.LazyGetService<ICancellationTokenProvider>(NullCancellationTokenProvider.Instance);

    private IEnumerable<INotificationPublishInterceptor>? _interceptors;
    protected IEnumerable<INotificationPublishInterceptor> Interceptors =>
        _interceptors ??= ServiceProvider.LazyGetService<IEnumerable<INotificationPublishInterceptor>>()
                          ?? Enumerable.Empty<INotificationPublishInterceptor>();

    public async virtual Task<bool> CanPublishAsync(NotificationInfo notification)
    {
        return await CanPublishAsync(notification, GetCancellationToken());
    }

    public async Task PublishAsync(NotificationPublishContext context)
    {
        var cancellationToken = GetCancellationToken();

        // Kiểm tra bộ chặn thông báo
        if (!await ExecuteInterceptorsAsync(context, cancellationToken))
        {
            return;
        }

        await PublishAsync(context, cancellationToken);
    }

    /// <summary>
    /// Có cho phép phát hành thông báo hay không
    /// </summary>
    /// <param name="notification"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    protected virtual Task<bool> CanPublishAsync(
        NotificationInfo notification,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(true);
    }

    /// <summary>
    /// Thực thi bộ chặn phát hành thông báo
    /// </summary>
    /// <param name="context"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    protected virtual async Task<bool> ExecuteInterceptorsAsync(
        NotificationPublishContext context,
        CancellationToken cancellationToken = default)
    {
        if (context.Notification.Type == NotificationType.System ||
            context.Notification.Type == NotificationType.ServiceCallback)
        {
            Logger.LogDebug(
                "System or service callback notification: {NotificationName}, skip all interceptors.",
                context.Notification.Name);
            return true;
        }

        if (context.Notification.Severity >= NotificationSeverity.Warn)
        {
            Logger.LogDebug(
                "Notifications above the warning level: {NotificationName}, skip all interceptors.",
                context.Notification.Name);
            return true;
        }

        if (!Interceptors.Any())
        {
            Logger.LogDebug("No notification publishing interceptors have been registered.");
            return true;
        }

        var orderedInterceptors = Interceptors.OrderBy(i => i.Priority);

        foreach (var interceptor in orderedInterceptors)
        {
            try
            {
                if (!await interceptor.CanPublishAsync(context.Notification))
                {
                    var reason = string.Format("The interceptor {0} prevented the publication of the notification {1}.",
                        interceptor.GetType().Name,
                        context.Notification.Name);

                    context.Cancel(reason);

                    Logger.LogWarning(reason);
                    return false;
                }
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex,
                    "An exception occurred while executing the interceptor {InterceptorType}. By default, publication is allowed.",
                    interceptor.GetType().Name);
            }
        }

        return true;
    }

    protected virtual CancellationToken GetCancellationToken(CancellationToken cancellationToken = default)
    {
        return CancellationTokenProvider.FallbackToProvider(cancellationToken);
    }
    /// <summary>
    /// Ghi đè để triển khai phát hành thông báo
    /// </summary>
    /// <param name="context">Bối cảnh gửi thông báo</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    protected abstract Task PublishAsync(NotificationPublishContext context, CancellationToken cancellationToken = default);
}
