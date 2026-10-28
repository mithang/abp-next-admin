using System.Threading.Tasks;

namespace LINGYUN.Abp.IM.Messages;

/// <summary>
/// Bộ chặn tin nhắn
/// </summary>
public interface IMessageBlocker
{
    Task InterceptAsync(ChatMessage message);
}
