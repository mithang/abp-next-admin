using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.Users;

namespace LINGYUN.Abp.MicroService.AllInOne.EventBus.Local;

public class UserCreateSubscribeIdentityNotificationsEventHandler : ILocalEventHandler<EntityCreatedEventData<UserEto>>, ITransientDependency
{
    private readonly INotificationSubscriptionManager _notificationSubscriptionManager;
    public UserCreateSubscribeIdentityNotificationsEventHandler(
        INotificationSubscriptionManager notificationSubscriptionManager
        )
    {
        _notificationSubscriptionManager = notificationSubscriptionManager;
    }

    public async virtual Task HandleEventAsync(EntityCreatedEventData<UserEto> eventData)
    {
        var userIdentifer = new UserIdentifier(eventData.Entity.Id, eventData.Entity.UserName);
        // Đăng ký nhận thông báo hết phiên người dùng
        await _notificationSubscriptionManager
            .SubscribeAsync(
                eventData.Entity.TenantId,
                userIdentifer,
                IdentityNotificationNames.Session.ExpirationSession);
        // Đăng ký nhận thông báo tài khoản người dùng không hoạt động
        await _notificationSubscriptionManager
            .SubscribeAsync(
                eventData.Entity.TenantId,
                userIdentifer,
                IdentityNotificationNames.IdentityUser.InactiveUserReminderNotifier);
        // Đăng ký nhận thông báo tài khoản người dùng bị vô hiệu hóa
        await _notificationSubscriptionManager
            .SubscribeAsync(
                eventData.Entity.TenantId,
                userIdentifer,
                IdentityNotificationNames.IdentityUser.InactiveUserDeactivationNotifier);
    }
}
