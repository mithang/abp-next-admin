using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Messages;
/// <summary>
/// Trình quản lý tin nhắn WeChat Work
/// </summary>
public interface IWeChatWorkMessageManager
{
    /// <summary>
    /// Thu hồi tin nhắn ứng dụng
    /// </summary>
    /// <remarks>
    /// Tham khảo:<see href="https://developer.work.weixin.qq.com/document/path/94867"/>
    /// </remarks>
    /// <param name="messageId">ID tin nhắn. Từ API gửi tin nhắn của ứng dụng <see cref="IWeChatWorkMessageSender"/>  thu được.</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> ReCallMessageAsync( string messageId, CancellationToken cancellationToken = default);

}
