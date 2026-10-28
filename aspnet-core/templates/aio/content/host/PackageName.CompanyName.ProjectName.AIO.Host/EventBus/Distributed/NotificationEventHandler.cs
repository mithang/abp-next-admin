using LINGYUN.Abp.Notifications;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using PackageName.CompanyName.ProjectName.AIO.Host.BackgroundJobs;
using PackageName.CompanyName.ProjectName.AIO.Host.MultiTenancy;
using System.Globalization;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.Json;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TextTemplating;
using Volo.Abp.Uow;

namespace PackageName.CompanyName.ProjectName.AIO.Host.EventBus.Distributed
{
    /// <summary>
    /// Đăng ký sự kiện phát hành thông báo, phát hành tin nhắn thống nhất
    /// </summary>
    /// <remarks>
    /// Tác dụng là client SignalR chỉ kết nối với một máy chủ,
    /// chỉ máy chủ đã bật SignalR mới thực sự phát hành tin nhắn tới client
    /// </remarks>
    public class NotificationEventHandler :
        IDistributedEventHandler<NotificationEto<NotificationData>>,
        IDistributedEventHandler<NotificationEto<NotificationTemplate>>,
        ITransientDependency
    {
        /// <summary>
        /// Reference to <see cref="ILogger<DefaultNotificationDispatcher>"/>.
        /// </summary>
        public ILogger<NotificationEventHandler> Logger { get; set; }
        /// <summary>
        /// Reference to <see cref="AbpNotificationsPublishOptions"/>.
        /// </summary>
        protected AbpNotificationsPublishOptions Options { get; }
        /// <summary>
        /// Reference to <see cref="ICurrentTenant"/>.
        /// </summary>
        protected ICurrentTenant CurrentTenant { get; }
        /// <summary>
        /// Reference to <see cref="ITenantConfigurationCache"/>.
        /// </summary>
        protected ITenantConfigurationCache TenantConfigurationCache { get; }
        /// <summary>
        /// Reference to <see cref="IJsonSerializer"/>.
        /// </summary>
        protected IJsonSerializer JsonSerializer { get; }
        /// <summary>
        /// Reference to <see cref="IBackgroundJobManager"/>.
        /// </summary>
        protected IBackgroundJobManager BackgroundJobManager { get; }
        /// <summary>
        /// Reference to <see cref="ITemplateRenderer"/>.
        /// </summary>
        protected ITemplateRenderer TemplateRenderer { get; }
        /// <summary>
        /// Reference to <see cref="INotificationStore"/>.
        /// </summary>
        protected INotificationStore NotificationStore { get; }
        /// <summary>
        /// Reference to <see cref="IStringLocalizerFactory"/>.
        /// </summary>
        protected IStringLocalizerFactory StringLocalizerFactory { get; }
        /// <summary>
        /// Reference to <see cref="INotificationDataSerializer"/>.
        /// </summary>
        protected INotificationDataSerializer NotificationDataSerializer { get; }
        /// <summary>
        /// Reference to <see cref="INotificationDefinitionManager"/>.
        /// </summary>
        protected INotificationDefinitionManager NotificationDefinitionManager { get; }
        /// <summary>
        /// Reference to <see cref="INotificationSubscriptionManager"/>.
        /// </summary>
        protected INotificationSubscriptionManager NotificationSubscriptionManager { get; }
        /// <summary>
        /// Reference to <see cref="INotificationPublishProviderManager"/>.
        /// </summary>
        protected INotificationPublishProviderManager NotificationPublishProviderManager { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="NotificationEventHandler"/> class.
        /// </summary>
        public NotificationEventHandler(
            ICurrentTenant currentTenant,
            ITenantConfigurationCache tenantConfigurationCache,
            IJsonSerializer jsonSerializer,
            ITemplateRenderer templateRenderer,
            IBackgroundJobManager backgroundJobManager,
            IStringLocalizerFactory stringLocalizerFactory,
            IOptions<AbpNotificationsPublishOptions> options,
            INotificationStore notificationStore,
            INotificationDataSerializer notificationDataSerializer,
            INotificationDefinitionManager notificationDefinitionManager,
            INotificationSubscriptionManager notificationSubscriptionManager,
            INotificationPublishProviderManager notificationPublishProviderManager)
        {
            Options = options.Value;
            TenantConfigurationCache = tenantConfigurationCache;
            CurrentTenant = currentTenant;
            JsonSerializer = jsonSerializer;
            TemplateRenderer = templateRenderer;
            BackgroundJobManager = backgroundJobManager;
            StringLocalizerFactory = stringLocalizerFactory;
            NotificationStore = notificationStore;
            NotificationDataSerializer = notificationDataSerializer;
            NotificationDefinitionManager = notificationDefinitionManager;
            NotificationSubscriptionManager = notificationSubscriptionManager;
            NotificationPublishProviderManager = notificationPublishProviderManager;

            Logger = NullLogger<NotificationEventHandler>.Instance;
        }

        [UnitOfWork]
        public async virtual Task HandleEventAsync(NotificationEto<NotificationTemplate> eventData)
        {
            var notification = await NotificationDefinitionManager.GetOrNullAsync(eventData.Name);
            if (notification == null)
            {
                return;
            }

            var culture = eventData.Data.Culture;
            if (culture.IsNullOrWhiteSpace())
            {
                culture = CultureInfo.CurrentCulture.Name;
            }
            using (CultureHelper.Use(culture, culture))
            {
                if (notification.NotificationType == NotificationType.System)
                {
                    using (CurrentTenant.Change(null))
                    {
                        await SendToTenantAsync(null, notification, eventData);

                        var allActiveTenants = await TenantConfigurationCache.GetTenantsAsync();

                        foreach (var activeTenant in allActiveTenants)
                        {
                            await SendToTenantAsync(activeTenant.Id, notification, eventData);
                        }
                    }
                }
                else
                {
                    await SendToTenantAsync(eventData.TenantId, notification, eventData);
                }
            }
        }

        [UnitOfWork]
        public async virtual Task HandleEventAsync(NotificationEto<NotificationData> eventData)
        {
            var notification = await NotificationDefinitionManager.GetOrNullAsync(eventData.Name);
            if (notification == null)
            {
                return;
            }

            if (notification.NotificationType == NotificationType.System)
            {
                using (CurrentTenant.Change(null))
                {
                    await SendToTenantAsync(null, notification, eventData);

                    var allActiveTenants = await TenantConfigurationCache.GetTenantsAsync();

                    foreach (var activeTenant in allActiveTenants)
                    {
                        await SendToTenantAsync(activeTenant.Id, notification, eventData);
                    }
                }
            }
            else
            {
                await SendToTenantAsync(eventData.TenantId, notification, eventData);
            }
        }

        protected async virtual Task SendToTenantAsync(
            Guid? tenantId,
            NotificationDefinition notification,
            NotificationEto<NotificationTemplate> eventData)
        {
            using (CurrentTenant.Change(tenantId))
            {
                var providers = Enumerable.Reverse(NotificationPublishProviderManager.Providers);

                // Lọc nhà cung cấp do người dùng chỉ định
                if (eventData.UseProviders.Any())
                {
                    providers = providers.Where(p => eventData.UseProviders.Contains(p.Name));
                }
                else if (notification.Providers.Any())
                {
                    providers = providers.Where(p => notification.Providers.Contains(p.Name));
                }

                var notificationInfo = new NotificationInfo
                {
                    Name = notification.Name,
                    TenantId = tenantId,
                    Severity = eventData.Severity,
                    Type = notification.NotificationType,
                    ContentType = notification.ContentType,
                    CreationTime = eventData.CreationTime,
                    Lifetime = notification.NotificationLifetime,
                };
                notificationInfo.SetId(eventData.Id);

                var title = notification.DisplayName.Localize(StringLocalizerFactory);
                var message = "";

                try
                {
                    // Do thông báo mẫu chịu ảnh hưởng của tenant, tin nhắn định dạng thất bại sẽ bị loại bỏ.
                    message = await TemplateRenderer.RenderAsync(
                        templateName: eventData.Data.Name,
                        model: eventData.Data.ExtraProperties,
                        cultureName: eventData.Data.Culture,
                        globalContext: new Dictionary<string, object>
                        {
                            // Mẫu không hỗ trợ ký tự $, đổi thành từ khóa thông thường
                            { NotificationKeywords.Name, notification.Name },
                            { NotificationKeywords.FormUser, eventData.Data.FormUser },
                            { NotificationKeywords.Id, eventData.Id },
                            { NotificationKeywords.Title, title.ToString() },
                            { NotificationKeywords.CreationTime, eventData.CreationTime.ToString(Options.DateTimeFormat) },
                        });
                }
                catch(Exception ex)
                {
                    Logger.LogWarning("Formatting template notification failed, message will be discarded, cause :{message}", ex.Message);
                    return;
                }

                var notificationData = new NotificationData();
                notificationData.WriteStandardData(
                    title: title.ToString(),
                    message: message,
                    createTime: eventData.CreationTime,
                    formUser: eventData.Data.FormUser);
                notificationData.ExtraProperties.AddIfNotContains(eventData.Data.ExtraProperties);

                notificationInfo.Data = notificationData;

                var subscriptionUsers = await GerSubscriptionUsersAsync(
                    notificationInfo.Name,
                    eventData.Users,
                    tenantId);

                await PersistentNotificationAsync(
                    notificationInfo,
                    subscriptionUsers,
                    providers);

                if (subscriptionUsers.Any())
                {
                    // Phát hành thông báo
                    foreach (var provider in providers)
                    {
                        await PublishToSubscriberAsync(provider, notificationInfo, subscriptionUsers);
                    }
                }
            }
        }

        protected async virtual Task SendToTenantAsync(
            Guid? tenantId,
            NotificationDefinition notification,
            NotificationEto<NotificationData> eventData)
        {
            using (CurrentTenant.Change(tenantId))
            {
                var providers = Enumerable.Reverse(NotificationPublishProviderManager.Providers);

                // Lọc nhà cung cấp do người dùng chỉ định
                if (eventData.UseProviders.Any())
                {
                    providers = providers.Where(p => eventData.UseProviders.Contains(p.Name));
                }
                else if (notification.Providers.Any())
                {
                    providers = providers.Where(p => notification.Providers.Contains(p.Name));
                }

                var notificationInfo = new NotificationInfo
                {
                    Name = notification.Name,
                    CreationTime = eventData.CreationTime,
                    Data = eventData.Data,
                    Severity = eventData.Severity,
                    Lifetime = notification.NotificationLifetime,
                    TenantId = tenantId,
                    Type = notification.NotificationType,
                    ContentType = notification.ContentType,
                };
                notificationInfo.SetId(eventData.Id);

                notificationInfo.Data = NotificationDataSerializer.Serialize(notificationInfo.Data);

                // Lấy danh sách đăng ký của người dùng
                var subscriptionUsers = await GerSubscriptionUsersAsync(
                    notificationInfo.Name,
                    eventData.Users,
                    tenantId);

                // Lưu bền thông báo
                await PersistentNotificationAsync(
                    notificationInfo,
                    subscriptionUsers,
                    providers);

                if (subscriptionUsers.Any())
                {
                    // Phát hành thông báo đã đăng ký
                    foreach (var provider in providers)
                    {
                        await PublishToSubscriberAsync(provider, notificationInfo, subscriptionUsers);
                    }
                }
            }
        }
        /// <summary>
        /// Lấy danh sách đăng ký của người dùng
        /// </summary>
        /// <param name="notificationName">Tên thông báo</param>
        /// <param name="sendToUsers">Danh sách người dùng nhận</param>
        /// <param name="tenantId">Định danh tenant</param>
        /// <returns>Danh sách đăng ký của người dùng</returns>
        protected async Task<IEnumerable<UserIdentifier>> GerSubscriptionUsersAsync(
            string notificationName,
            IEnumerable<UserIdentifier> sendToUsers,
            Guid? tenantId = null)
        {
            try
            {
                // Lấy danh sách đăng ký của người dùng
                var userSubscriptions = await NotificationSubscriptionManager.GetUsersSubscriptionsAsync(
                    tenantId,
                    notificationName,
                    sendToUsers);

                return userSubscriptions.Select(us => new UserIdentifier(us.UserId, us.UserName));
            }
            catch(Exception ex)
            {
                Logger.LogWarning("Failed to get user subscription, message will not be received by the user, reason: {message}", ex.Message);
            }

            return new List<UserIdentifier>();
        }
        /// <summary>
        /// Lưu bền thông báo và trả về danh sách người dùng đăng ký
        /// </summary>
        /// <param name="notificationInfo">Thực thể thông báo</param>
        /// <param name="subscriptionUsers">Danh sách người dùng đăng ký</param>
        /// <param name="sendToProviders">Nhà cung cấp gửi thông báo</param>
        /// <returns>Trả về danh sách người đăng ký</returns>
        protected async Task PersistentNotificationAsync(
            NotificationInfo notificationInfo,
            IEnumerable<UserIdentifier> subscriptionUsers,
            IEnumerable<INotificationPublishProvider> sendToProviders)
        {
            try
            {
                // Lưu bền thông báo
                await NotificationStore.InsertNotificationAsync(notificationInfo);

                if (!subscriptionUsers.Any())
                {
                    return;
                }

                // Lưu bền thông báo của người dùng
                await NotificationStore.InsertUserNotificationsAsync(notificationInfo, subscriptionUsers.Select(u => u.UserId));

                if (notificationInfo.Lifetime == NotificationLifetime.OnlyOne)
                {
                    // Thông báo một lần sẽ hủy đăng ký của người dùng
                    await NotificationStore.DeleteUserSubscriptionAsync(
                        notificationInfo.TenantId,
                        subscriptionUsers,
                        notificationInfo.Name);
                }
            }
            catch (Exception ex)
            {
                Logger.LogWarning("Failed to persistent notification failed, reason: {message}", ex.Message);

                foreach (var provider in sendToProviders)
                {
                    // Xử lý khi lưu bền thất bại, đưa vào hàng đợi nền
                    await ProcessingFailedToQueueAsync(provider, notificationInfo, subscriptionUsers);
                }
            }
        }
        /// <summary>
        /// Phát hành thông báo cho người đăng ký
        /// </summary>
        /// <param name="provider">Nhà phát hành thông báo</param>
        /// <param name="notificationInfo">Thông tin thông báo</param>
        /// <param name="subscriptionUserIdentifiers">Danh sách người dùng đăng ký</param>
        /// <returns></returns>
        protected async Task PublishToSubscriberAsync(
            INotificationPublishProvider provider,
            NotificationInfo notificationInfo,
            IEnumerable<UserIdentifier> subscriptionUsers)
        {
            try
            {
                Logger.LogDebug($"Sending notification with provider {provider.Name}");

                // 2024-10-10: Ở tầng framework nên bỏ chuyển đổi dữ liệu thông báo, mà giao cho nhà cung cấp thực hiện
                //var notifacationDataMapping = Options.NotificationDataMappings
                //        .GetMapItemOrDefault(provider.Name, notificationInfo.Name);
                //if (notifacationDataMapping != null)
                //{
                //    notificationInfo.Data = notifacationDataMapping.MappingFunc(notificationInfo.Data);
                //}

                // Phát hành
                await provider.PublishAsync(notificationInfo, subscriptionUsers);

                Logger.LogDebug($"Send notification {notificationInfo.Name} with provider {provider.Name} was successful");
            }
            catch (Exception ex)
            {
                Logger.LogWarning($"Send notification error with provider {provider.Name}");
                Logger.LogWarning($"Error message:{ex.Message}");
                Logger.LogDebug($"Failed to send notification {notificationInfo.Name}. Try to push notification to background job");
                // Tin nhắn gửi thất bại sẽ vào hàng đợi nền
                await ProcessingFailedToQueueAsync(provider, notificationInfo, subscriptionUsers);
            }
        }
        /// <summary>
        /// Xử lý tin nhắn thất bại, đưa vào hàng đợi nền
        /// </summary>
        /// <remarks>
        /// Lưu ý: nếu đưa vào hàng đợi thất bại, tin nhắn sẽ bị loại bỏ.
        /// </remarks>
        /// <param name="provider"></param>
        /// <param name="notificationInfo"></param>
        /// <param name="subscriptionUsers"></param>
        /// <returns></returns>
        protected async Task ProcessingFailedToQueueAsync(
            INotificationPublishProvider provider,
            NotificationInfo notificationInfo,
            IEnumerable<UserIdentifier> subscriptionUsers)
        {
            try
            {
                // Tin nhắn gửi thất bại sẽ vào hàng đợi nền
                await BackgroundJobManager.EnqueueAsync(
                    new NotificationPublishJobArgs(
                        notificationInfo.GetId(),
                        provider.GetType().AssemblyQualifiedName,
                        subscriptionUsers.ToList(),
                        notificationInfo.TenantId));
            }
            catch(Exception ex)
            {
                Logger.LogWarning("Failed to push to background job, notification will be discarded, error cause: {message}", ex.Message);
            }
        }
    }
}
