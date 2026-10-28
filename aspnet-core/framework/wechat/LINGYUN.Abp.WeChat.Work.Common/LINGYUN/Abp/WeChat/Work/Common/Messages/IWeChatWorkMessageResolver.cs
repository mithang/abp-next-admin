using LINGYUN.Abp.WeChat.Common.Messages;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages;
/// <summary>
/// Trình phân tích tin nhắn WeChat Work
/// </summary>
public interface IWeChatWorkMessageResolver
{
    /// <summary>
    /// Phân tích tin nhắn WeChat Work
    /// </summary>
    /// <param name="messageData">Tin nhắn WeChat Work</param>
    /// <returns></returns>
    Task<MessageResolveResult> ResolveAsync(MessageResolveData messageData);
}
