using LINGYUN.Abp.WeChat.Official.Services.Models;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Official.Services;
/// <summary>
/// Interface tin nhắn trung tâm dịch vụ khách hàng
/// </summary>
public interface IServiceCenterMessageSender
{
    Task SendAsync(MessageModel message, CancellationToken cancellationToken = default);
}
