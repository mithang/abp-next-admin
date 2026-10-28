using JetBrains.Annotations;
using System;
using System.Threading.Tasks;
using Volo.Abp;

namespace LINGYUN.Abp.Notifications;
public static class INotificationSenderExtensions
{
    /// <summary>
    /// Gửi thông báo
    /// </summary>
    /// <param name="sender">Giao diện gửi</param>
    /// <param name="name">Tên</param>
    /// <param name="data">Dữ liệu</param>
    /// <param name="user">Người dùng, để trống nghĩa là gửi cho tất cả người dùng đã đăng ký</param>
    /// <param name="tenantId">Tenant</param>
    /// <param name="severity">Mức độ nghiêm trọng</param>
    /// <returns>Định danh thông báo</returns>
    public async static Task<string> SendNofiterAsync(
        [NotNull] this INotificationSender sender,
        [NotNull] string name,
        [NotNull] NotificationData data,
        UserIdentifier? user = null,
        Guid? tenantId = null,
        NotificationSeverity severity = NotificationSeverity.Info)
    {
        Check.NotNull(sender, nameof(sender));
        Check.NotNullOrWhiteSpace(name, nameof(name));
        Check.NotNull(data, nameof(data));

        if (user == null)
        {
            return await sender.SendNofiterAsync(name, data, tenantId: tenantId, severity: severity);
        }
        return await sender.SendNofiterAsync(name, data, new[] { user },tenantId: tenantId, severity: severity);
    }

    /// <summary>
    /// Gửi thông báo mẫu
    /// </summary>
    /// <param name="sender">Giao diện gửi</param>
    /// <param name="name">Tên</param>
    /// <param name="template">Đối tượng mẫu</param>
    /// <param name="user">Người dùng, để trống nghĩa là gửi cho tất cả người dùng đã đăng ký</param>
    /// <param name="tenantId">Tenant</param>
    /// <param name="severity">Mức độ nghiêm trọng</param>
    /// <returns>Định danh thông báo</returns>
    public async static Task<string> SendNofiterAsync(
        [NotNull] this INotificationSender sender,
        [NotNull] string name,
        [NotNull] NotificationTemplate template,
        UserIdentifier? user = null,
        Guid? tenantId = null,
        NotificationSeverity severity = NotificationSeverity.Info)
    {
        Check.NotNull(sender, nameof(sender));
        Check.NotNullOrWhiteSpace(name, nameof(name));
        Check.NotNull(template, nameof(template));

        if (user == null)
        {
            return await sender.SendNofiterAsync(name, template, tenantId: tenantId, severity: severity);
        }
        return await sender.SendNofiterAsync(name, template, new[] { user }, tenantId: tenantId, severity: severity);
    }
}
