using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.PushPlus.Channel.Webhook;
/// <summary>
/// Giao diện cấu hình Webhook
/// </summary>
public interface IPushPlusWebhookProvider
{
    /// <summary>
    /// Lấy danh sách webhook
    /// </summary>
    /// <param name="current">Số trang hiện tại</param>
    /// <param name="pageSize">Kích thước mỗi trang, tối đa 50</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusPagedResponse<PushPlusWebhook>> GetWebhookListAsync(
        int current = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Chi tiết webhook
    /// </summary>
    /// <param name="webhookId">Mã số webhook</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusWebhook> GetWebhookAsync(
        int webhookId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thêm webhook mới
    /// </summary>
    /// <param name="webhookCode">Mã webhook</param>
    /// <param name="webhookName">Tên webhook</param>
    /// <param name="webhookType">Loại webhook; 1-WeChat doanh nghiệp, 2-DingTalk, 3-FeiShu, 4-ServerChan</param>
    /// <param name="webhookUrl">Địa chỉ url được gọi</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> CreateWebhookAsync(
        string webhookCode,
        string webhookName,
        PushPlusWebhookType webhookType,
        string webhookUrl,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Sửa đổi cấu hình webhook
    /// </summary>
    /// <param name="id">Mã số webhook</param>
    /// <param name="webhookCode">Mã webhook</param>
    /// <param name="webhookName">Tên webhook</param>
    /// <param name="webhookType">Loại webhook; 1-WeChat doanh nghiệp, 2-DingTalk, 3-FeiShu, 4-ServerChan</param>
    /// <param name="webhookUrl">Địa chỉ url được gọi</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<string> UpdateWebhookAsync(
        int id,
        string webhookCode,
        string webhookName,
        PushPlusWebhookType webhookType,
        string webhookUrl,
        CancellationToken cancellationToken = default);
}
