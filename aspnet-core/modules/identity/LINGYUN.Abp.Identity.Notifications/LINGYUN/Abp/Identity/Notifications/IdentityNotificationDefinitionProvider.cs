using LINGYUN.Abp.Notifications;
using Volo.Abp.Identity.Localization;
using Volo.Abp.Localization;

namespace LINGYUN.Abp.Identity.Notifications;
public class IdentityNotificationDefinitionProvider : NotificationDefinitionProvider
{
    public override void Define(INotificationDefinitionContext context)
    {
        var group = context.AddGroup(
            IdentityNotificationNames.GroupName,
            L("Notifications:AbpIdentity"),
            L("Notifications:AbpIdentity"));

        group.AddNotification(
            IdentityNotificationNames.Session.ExpirationSession,
            L("Notifications:SessionExpiration"),
            L("Notifications:SessionExpiration"),
            NotificationType.ServiceCallback,
            NotificationLifetime.Persistent,
            NotificationContentType.Json,
            allowSubscriptionToClients: false) // Vô hiệu hóa ở máy khách, mọi người dùng mới đều phải đăng ký thông báo này
            .WithProviders(
                NotificationProviderNames.SignalR, // Thông báo thời gian thực xử lý sự kiện hết hạn phiên làm việc
                NotificationProviderNames.Emailing); // Thông báo qua email khi phiên làm việc hết hạn

        // Thông báo giữ tài khoản hoạt động
        group.AddNotification(
            IdentityNotificationNames.IdentityUser.InactiveUserReminderNotifier,
            L("InactiveUserReminderNotifier"),
            L("InactiveUserReminderNotifier"),
            NotificationType.User,
            NotificationLifetime.Persistent,
            NotificationContentType.Html,
            allowSubscriptionToClients: false) // Vô hiệu hóa ở máy khách, mọi người dùng mới đều phải đăng ký thông báo này
            .WithProviders(NotificationProviderNames.Emailing);
        // Thông báo vô hiệu hóa tài khoản
        group.AddNotification(
            IdentityNotificationNames.IdentityUser.InactiveUserDeactivationNotifier,
            L("InactiveUserDeactivationNotifier"),
            L("InactiveUserDeactivationNotifier"),
            NotificationType.User,
            NotificationLifetime.Persistent,
            NotificationContentType.Html,
            allowSubscriptionToClients: false) // Vô hiệu hóa ở máy khách, mọi người dùng mới đều phải đăng ký thông báo này
            .WithProviders(NotificationProviderNames.Emailing);
        // Thông báo xóa tài khoản không cần thêm, chỉ cần gửi thông báo qua email, vì khi phát hành thông báo thì người dùng đã bị xóa
    }

    private static ILocalizableString L(string name)
    {
        return LocalizableString.Create<IdentityResource>(name);
    }
}
