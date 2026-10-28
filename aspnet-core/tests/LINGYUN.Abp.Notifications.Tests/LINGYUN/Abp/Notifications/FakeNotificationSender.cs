using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Json;
using Volo.Abp.TextTemplating;

namespace LINGYUN.Abp.Notifications;

[Dependency(ReplaceServices = true)]
public class FakeNotificationSender : INotificationSender, ITransientDependency
{
    public ILogger<FakeNotificationSender> Logger { get; set; }

    protected AbpNotificationsPublishOptions Options { get; }

    protected IJsonSerializer JsonSerializer { get; }

    protected ITemplateRenderer TemplateRenderer { get; }

    protected INotificationStore NotificationStore { get; }

    protected INotificationDataSerializer NotificationDataSerializer { get; }

    protected IStringLocalizerFactory StringLocalizerFactory { get; }

    protected INotificationDefinitionManager NotificationDefinitionManager { get; }

    protected INotificationSubscriptionManager NotificationSubscriptionManager { get; }

    protected INotificationPublishProviderManager NotificationPublishProviderManager { get; }

    public FakeNotificationSender(
        IJsonSerializer jsonSerializer,
        ITemplateRenderer templateRenderer,
        IStringLocalizerFactory stringLocalizerFactory,
        IOptions<AbpNotificationsPublishOptions> options,
        INotificationStore notificationStore,
        INotificationDataSerializer notificationDataSerializer,
        INotificationDefinitionManager notificationDefinitionManager,
        INotificationSubscriptionManager notificationSubscriptionManager,
        INotificationPublishProviderManager notificationPublishProviderManager)
    {
        Options = options.Value;
        JsonSerializer = jsonSerializer;
        TemplateRenderer = templateRenderer;
        StringLocalizerFactory = stringLocalizerFactory;
        NotificationStore = notificationStore;
        NotificationDataSerializer = notificationDataSerializer;
        NotificationDefinitionManager = notificationDefinitionManager;
        NotificationSubscriptionManager = notificationSubscriptionManager;
        NotificationPublishProviderManager = notificationPublishProviderManager;

        Logger = NullLogger<FakeNotificationSender>.Instance;
    }

    public async virtual Task<string> SendNofiterAsync(
        string name,
        NotificationData data, 
        IEnumerable<UserIdentifier> users = null,
        Guid? tenantId = null, 
        NotificationSeverity severity = NotificationSeverity.Info,
        IEnumerable<string> useProviders = null)
    {
        var notification = await NotificationDefinitionManager.GetOrNullAsync(name);
        if (notification == null)
        {
            return "";
        }

        var notificationInfo = new NotificationInfo
        {
            Name = notification.Name,
            CreationTime = DateTime.Now,
            Data = data,
            Severity = severity,
            Lifetime = notification.NotificationLifetime,
            TenantId = tenantId,
            Type = notification.NotificationType
        };
        notificationInfo.SetId(DateTimeOffset.Now.ToUnixTimeMilliseconds());

        notificationInfo.Data = NotificationDataSerializer.Serialize(notificationInfo.Data);

        Logger.LogDebug($"Persistent notification {notificationInfo.Name}");

        await NotificationStore.InsertNotificationAsync(notificationInfo);

        var providers = Enumerable.Reverse(NotificationPublishProviderManager.Providers);

        if (useProviders?.Any() == true)
        {
            providers = providers.Where(p => useProviders.Contains(p.Name));
        }
        else if (notification.Providers.Any())
        {
            providers = providers.Where(p => notification.Providers.Contains(p.Name));
        }

        await PublishFromProvidersAsync(
            providers,
            users ?? new List<UserIdentifier>(), 
            notificationInfo);

        return notificationInfo.Id;
    }

    public async virtual Task<string> SendNofiterAsync(
        string name,
        NotificationTemplate template, 
        IEnumerable<UserIdentifier> users = null,
        Guid? tenantId = null, 
        NotificationSeverity severity = NotificationSeverity.Info,
        IEnumerable<string> useProviders = null)
    {
        var notification = await NotificationDefinitionManager.GetOrNullAsync(name);
        if (notification == null)
        {
            return "";
        }

        var notificationInfo = new NotificationInfo
        {
            Name = notification.Name,
            TenantId = tenantId,
            Severity = severity,
            Type = notification.NotificationType,
            CreationTime = DateTime.Now,
            Lifetime = notification.NotificationLifetime,
        };
        notificationInfo.SetId(DateTimeOffset.Now.ToUnixTimeMilliseconds());

        var title = notification.DisplayName.Localize(StringLocalizerFactory);

        var message = await TemplateRenderer.RenderAsync(
            templateName: name,
            model: template.ExtraProperties);

        var notificationData = new NotificationData();
        notificationData.WriteStandardData(
            title: title,
            message: message,
            createTime: notificationInfo.CreationTime,
            formUser: "Fake User");
        notificationData.ExtraProperties.AddIfNotContains(template.ExtraProperties);

        notificationInfo.Data = notificationData;

        Logger.LogDebug($"Persistent notification {notificationInfo.Name}");

        // Lưu trữ thông báo
        await NotificationStore.InsertNotificationAsync(notificationInfo);

        var providers = Enumerable.Reverse(NotificationPublishProviderManager.Providers);

        // Lọc các nhà cung cấp do người dùng chỉ định
        if (useProviders?.Any() == true)
        {
            providers = providers.Where(p => useProviders.Contains(p.Name));
        }
        else if (notification.Providers.Any())
        {
            providers = providers.Where(p => notification.Providers.Contains(p.Name));
        }

        await PublishFromProvidersAsync(
            providers, 
            users ?? new List<UserIdentifier>(), 
            notificationInfo);

        return notificationInfo.Id;
    }

    /// <summary>
    /// Phát hành thông báo tới nhà cung cấp được chỉ định
    /// </summary>
    /// <param name="providers">Danh sách nhà cung cấp</param>
    /// <param name="notificationInfo">Thông tin thông báo</param>
    /// <returns></returns>
    protected async Task PublishFromProvidersAsync(
        IEnumerable<INotificationPublishProvider> providers,
        IEnumerable<UserIdentifier> users,
        NotificationInfo notificationInfo)
    {
        foreach (var provider in providers)
        {
            await PublishAsync(provider, notificationInfo, users);
        }
    }
    /// <summary>
    /// Phát hành thông báo
    /// </summary>
    /// <param name="provider">Nhà phát hành thông báo</param>
    /// <param name="notificationInfo">Thông tin thông báo</param>
    /// <param name="subscriptionUserIdentifiers">Danh sách người dùng đã đăng ký</param>
    /// <returns></returns>
    protected async Task PublishAsync(
        INotificationPublishProvider provider,
        NotificationInfo notificationInfo,
        IEnumerable<UserIdentifier> subscriptionUserIdentifiers)
    {
        Logger.LogDebug($"Sending notification with provider {provider.Name}");
        // var notifacationDataMapping = Options.NotificationDataMappings
        //         .GetMapItemOrDefault(provider.Name, notificationInfo.Name);
        // if (notifacationDataMapping != null)
        // {
        //     notificationInfo.Data = notifacationDataMapping.MappingFunc(notificationInfo.Data);
        // }
        // Phát hành
        // Hợp đồng đã được di chuyển sang NotificationPublishContext (xem INotificationPublishProvider)
        var context = new NotificationPublishContext(notificationInfo, subscriptionUserIdentifiers);
        await provider.PublishAsync(context);

        if (!context.Reason.IsNullOrWhiteSpace())
        {
            Logger.LogWarning(
                "Send notification {Name} with provider {Provider} was cancelled: {Reason}",
                notificationInfo.Name,
                provider.Name,
                context.Reason);
        }
        else
        {
            Logger.LogDebug($"Send notification {notificationInfo.Name} with provider {provider.Name} was successful");
        }
    }
}
