using System.Threading.Tasks;

namespace LINGYUN.Abp.IM.Messages;

/// <summary>
/// Bộ xử lý tin nhắn
/// </summary>
public interface IMessageProcessor
{
    /// <summary>
    /// Thu hồi
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task ReCallAsync(ChatMessage message);
    /// <summary>
    /// Tin nhắn đã đọc
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task ReadAsync(ChatMessage message);
}
