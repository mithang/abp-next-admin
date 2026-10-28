using LINGYUN.Abp.PushPlus.Channel;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.PushPlus.Setting;
/// <summary>
/// Giao diện kênh gửi
/// </summary>
public interface IPushPlusChannelProvider
{
    /// <summary>
    /// Lấy kênh gửi mặc định
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusChannel> GetDefaultChannelAsync(
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thay đổi kênh gửi mặc định
    /// </summary>
    /// <param name="defaultChannel">Kênh mặc định; wechat-Tài khoản công khai WeChat, mail-Email, cp-Ứng dụng WeChat doanh nghiệp, webhook-Webhook bên thứ ba</param>
    /// <param name="defaultWebhook">Tham số kênh; kênh webhook và cp cần điền số webhook cụ thể hoặc mã tùy chỉnh</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task UpdateDefaultChannelAsync(
        PushPlusChannelType defaultChannel,
        string defaultWebhook = "",
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thay đổi giới hạn nhận tin nhắn
    /// </summary>
    /// <param name="recevieLimit">Giới hạn nhận tin nhắn; 0-Nhận tất cả, 1-Không nhận tin nhắn</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task UpdateRecevieLimitAsync(
        PushPlusChannelRecevieLimit recevieLimit,
        CancellationToken cancellationToken = default);
}
