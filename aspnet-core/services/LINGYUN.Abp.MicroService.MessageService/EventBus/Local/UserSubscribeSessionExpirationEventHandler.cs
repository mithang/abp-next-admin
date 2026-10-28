using LINGYUN.Abp.Identity.Notifications;
using LINGYUN.Abp.Notifications;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.EventBus;
using Volo.Abp.Users;

namespace LINGYUN.Abp.MicroService.MessageService.EventBus;

public class UserSubscribeSessionExpirationEventHandler : ILocalEventHandler<EntityCreatedEventData<UserEto>>, ITransientDependency
{
    private readonly INotificationSubscriptionManager _notificationSubscriptionManager;

    public UserSubscribeSessionExpirationEventHandler(INotificationSubscriptionManager notificationSubscriptionManager)
    {
        _notificationSubscriptionManager = notificationSubscriptionManager; 
    }

    public async virtual Task HandleEventAsync(EntityCreatedEventData<UserEto> eventData)
    {
        // Thông báo hết hạn phiên đăng ký của người dùng mới
        await _notificationSubscriptionManager
            .SubscribeAsync(
                eventData.Entity.TenantId,
                new UserIdentifier(eventData.Entity.Id, eventData.Entity.UserName),
                IdentityNotificationNames.Session.ExpirationSession);
        // Thông báo liên quan tới người dùng không hoạt động cho người dùng mới đăng ký
        await _notificationSubscriptionManager
            .SubscribeAsync(
                eventData.Entity.TenantId,
                new UserIdentifier(eventData.Entity.Id, eventData.Entity.UserName),
                IdentityNotificationNames.IdentityUser.InactiveUserReminderNotifier);
        await _notificationSubscriptionManager
            .SubscribeAsync(
                eventData.Entity.TenantId,
                new UserIdentifier(eventData.Entity.Id, eventData.Entity.UserName),
                IdentityNotificationNames.IdentityUser.InactiveUserDeactivationNotifier);
    }
}
