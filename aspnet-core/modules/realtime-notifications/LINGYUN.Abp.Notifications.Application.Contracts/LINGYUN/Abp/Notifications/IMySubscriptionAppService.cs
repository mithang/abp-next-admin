using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.Notifications;

public interface IMySubscriptionAppService : IApplicationService
{
    /// <summary>
    /// Đã đăng ký nhận tin nhắn hay chưa
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<UserSubscriptionsResult> IsSubscribedAsync(SubscriptionsGetByNameDto input);
    /// <summary>
    /// Đăng ký nhận tin nhắn
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task SubscribeAsync(SubscriptionsGetByNameDto input);
    /// <summary>
    /// Hủy đăng ký nhận tin nhắn
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task UnSubscribeAsync(SubscriptionsGetByNameDto input);
    /// <summary>
    /// Lấy danh sách đăng ký
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<UserSubscreNotificationDto>> GetListAsync(SubscriptionsGetByPagedDto input);
    /// <summary>
    /// Lấy tất cả danh sách đăng ký
    /// </summary>
    /// <returns></returns>
    Task<ListResultDto<UserSubscreNotificationDto>> GetAllListAsync();
}
