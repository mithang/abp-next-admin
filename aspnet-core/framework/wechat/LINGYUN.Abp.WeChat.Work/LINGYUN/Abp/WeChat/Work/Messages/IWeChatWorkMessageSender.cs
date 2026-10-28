using LINGYUN.Abp.WeChat.Work.Messages.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Messages;
/// <summary>
/// Giao diện gửi tin nhắn
/// </summary>
public interface IWeChatWorkMessageSender
{
    /// <summary>
    /// Gửi tin nhắn ứng dụng
    /// </summary>
    /// <remarks>
    /// Tham khảo:<see href="https://developer.work.weixin.qq.com/document/path/90236"/>
    /// </remarks>
    /// <param name="message">Đối tượng chứa tin nhắn WeChat Work kế thừa từ <see cref="WeChatWorkMessage"/></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkMessageResponse> SendAsync(
        WeChatWorkMessage message,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Gửi tin nhắn trò chuyện nhóm
    /// </summary>
    /// <remarks>
    /// Tham khảo:<see href="https://developer.work.weixin.qq.com/document/path/90248"/>
    /// </remarks>
    /// <param name="message">Đối tượng chứa tin nhắn trò chuyện nhóm WeChat Work kế thừa từ <see cref="WeChatWorkAppChatMessage"/></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> SendAsync(
        WeChatWorkAppChatMessage message,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Gửi tin nhắn Webhook
    /// </summary>
    /// <remarks>
    /// Tham khảo:<see href="https://developer.work.weixin.qq.com/document/path/99110"/>
    /// </remarks>
    /// <param name="webhookKey">Khóa webhook dùng để đẩy tin nhắn</param>
    /// <param name="message">Đối tượng chứa tin nhắn Webhook WeChat Work kế thừa từ <see cref="WeChatWorkWebhookMessage"/></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> SendAsync(
        string webhookKey,
        WeChatWorkWebhookMessage message,
        CancellationToken cancellationToken = default);
}
