using LINGYUN.Abp.IdGenerator;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Triển khai mặc định gửi thông báo qua sự kiện phân tán
/// Có thể thay thế triển khai để gửi thông báo thời gian thực
/// </summary>
public class NotificationSender : INotificationSender, ITransientDependency
{
    /// <summary>
    /// Reference to <see cref="IClock"/>.
    /// </summary>
    protected IClock Clock { get; }
    /// <summary>
    /// Reference to <see cref="ILogger<NotificationSender>"/>.
    /// </summary>
    public ILogger<NotificationSender> Logger { get; set; }
    /// <summary>
    /// Reference to <see cref="IDistributedEventBus"/>.
    /// </summary>
    public IDistributedEventBus DistributedEventBus { get; }
    /// <summary>
    /// Reference to <see cref="IDistributedIdGenerator"/>.
    /// </summary>
    protected IDistributedIdGenerator DistributedIdGenerator { get; }
    /// <summary>
    /// Reference to <see cref="IUnitOfWorkManager"/>.
    /// </summary>
    protected IUnitOfWorkManager UnitOfWorkManager { get; }

    protected AbpNotificationsPublishOptions Options { get; }
    public NotificationSender(
        IClock clock,
        IDistributedEventBus distributedEventBus,
        IDistributedIdGenerator distributedIdGenerator,
        IUnitOfWorkManager unitOfWorkManager,
        IOptions<AbpNotificationsPublishOptions> options)
    {
        Clock = clock;
        Options = options.Value;
        DistributedEventBus = distributedEventBus;
        DistributedIdGenerator = distributedIdGenerator;
        UnitOfWorkManager = unitOfWorkManager;
        Logger = NullLogger<NotificationSender>.Instance;
    }

    public async virtual Task<string> SendNofiterAsync(
        string name, 
        NotificationData data,
        IEnumerable<UserIdentifier>? users = null,
        Guid? tenantId = null, 
        NotificationSeverity severity = NotificationSeverity.Info,
        IEnumerable<string>? useProviders = null)
    {
        return await PublishNofiterAsync(name, data, users, tenantId, severity, useProviders);
    }

    public async virtual Task<string> SendNofiterAsync(
        string name,
        NotificationTemplate template,
        IEnumerable<UserIdentifier>? users = null, 
        Guid? tenantId = null, 
        NotificationSeverity severity = NotificationSeverity.Info,
        IEnumerable<string>? useProviders = null)
    {
        return await PublishNofiterAsync(name, template, users, tenantId, severity, useProviders);
    }

    protected async virtual Task<string> PublishNofiterAsync<TData>(
        string name,
        TData data,
        IEnumerable<UserIdentifier>? users = null,
        Guid? tenantId = null,
        NotificationSeverity severity = NotificationSeverity.Info,
        IEnumerable<string>? useProviders = null)
    {
        var eto = new NotificationEto<TData>(data)
        {
            Id = DistributedIdGenerator.Create(),
            TenantId = tenantId,
            Users = users?.ToList() ?? new List<UserIdentifier>(),
            Name = name,
            CreationTime = Clock.Now,
            Severity = severity,
            UseProviders = useProviders?.ToList() ?? new List<string>()
        };

        if (UnitOfWorkManager.Current != null)
        {
            UnitOfWorkManager.Current.OnCompleted(async () =>
            {
                await DistributedEventBus.PublishAsync(eto);
            });
        }
        else
        {
            await DistributedEventBus.PublishAsync(eto);
        }

        return eto.Id.ToString();
    }
}
