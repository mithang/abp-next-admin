using LINGYUN.Abp.WeChat.Common.Messages;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Official.Messages;
/// <summary>
/// Bộ phân tích thông điệp Tài khoản chính thức WeChat
/// </summary>
public interface IWeChatOfficialMessageResolver
{
    /// <summary>
    /// Phân tích thông điệp Tài khoản chính thức WeChat
    /// </summary>
    /// <param name="messageData">Thông điệp tài khoản chính thức</param>
    /// <returns></returns>
    Task<MessageResolveResult> ResolveAsync(MessageResolveData messageData);
}
