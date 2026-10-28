using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Trình quản lý đăng ký thông báo
/// </summary>
public interface INotificationSubscriptionManager
{
    /// <summary>
    /// Đã đăng ký hay chưa
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="userId">Định danh người dùng</param>
    /// <param name="notificationName">Tên thông báo</param>
    /// <returns></returns>
    Task<bool> IsSubscribedAsync(
        Guid? tenantId, 
        Guid userId, 
        string notificationName,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Đăng ký thông báo
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="identifier">Định danh người dùng</param>
    /// <param name="notificationName">Tên thông báo</param>
    /// <returns></returns>
    Task SubscribeAsync(
        Guid? tenantId,
        UserIdentifier identifier, 
        string notificationName,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Đăng ký thông báo
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="identifiers">Danh sách định danh người dùng</param>
    /// <param name="notificationName">Tên thông báo</param>
    /// <returns></returns>
    Task SubscribeAsync(
        Guid? tenantId, 
        IEnumerable<UserIdentifier> identifiers,
        string notificationName,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Hủy đăng ký của tất cả người dùng
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="notificationName">Tên thông báo</param>
    /// <returns></returns>
    Task UnsubscribeAllAsync(
        Guid? tenantId, 
        string notificationName,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Hủy đăng ký
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="identifier">Định danh người dùng</param>
    /// <param name="notificationName">Tên thông báo</param>
    /// <returns></returns>
    Task UnsubscribeAsync(
        Guid? tenantId, 
        UserIdentifier identifier, 
        string notificationName,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Hủy đăng ký
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="identifiers">Danh sách định danh người dùng</param>
    /// <param name="notificationName">Tên thông báo</param>
    /// <returns></returns>
    Task UnsubscribeAsync(
        Guid? tenantId, 
        IEnumerable<UserIdentifier> identifiers,
        string notificationName,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách người dùng đã đăng ký thông báo
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="notificationName">Tên thông báo</param>
    /// <param name="identifiers">Danh sách người dùng cần kiểm tra</param>
    /// <returns></returns>
    Task<List<NotificationSubscriptionInfo>> GetUsersSubscriptionsAsync(
        Guid? tenantId, 
        string notificationName, 
        IEnumerable<UserIdentifier>? identifiers = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách đăng ký của người dùng
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="userId">Định danh người dùng</param>
    /// <returns></returns>
    Task<List<NotificationSubscriptionInfo>> GetUserSubscriptionsAsync(
        Guid? tenantId, 
        Guid userId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách đăng ký của người dùng
    /// </summary>
    /// <param name="tenantId">Tenant</param>
    /// <param name="userName">Tên người dùng</param>
    /// <returns></returns>
    Task<List<NotificationSubscriptionInfo>> GetUserSubscriptionsAsync(
        Guid? tenantId, 
        string userName,
        CancellationToken cancellationToken = default);
}
