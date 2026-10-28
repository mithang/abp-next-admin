using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.WeChat.Official.Message;
/// <summary>
/// Giao diện tin nhắn WeChat
/// </summary>
public interface IWeChatMessageAppService : IApplicationService
{
    /// <summary>
    /// Kiểm tra tin nhắn WeChat
    /// </summary>
    /// <remarks>
    /// Tài liệu tham khảo: <see cref="https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html"/>
    /// </remarks>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<string> Handle(MessageValidationInput input);
    /// <summary>
    /// Xử lý tin nhắn WeChat
    /// </summary>
    /// <remarks>
    /// Tài liệu tham khảo: <see cref="https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html"/>
    /// </remarks>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<string> Handle(MessageHandleInput input);
}
