using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.WeChat.Work.Message;
/// <summary>
/// Giao diện tin nhắn WeChat doanh nghiệp
/// </summary>
public interface IWeChatWorkMessageAppService : IApplicationService
{
    /// <summary>
    /// Kiểm tra tin nhắn WeChat doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Tài liệu tham khảo: <see cref="https://developer.work.weixin.qq.com/document/path/90238"/>
    /// </remarks>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<string> Handle(MessageValidationInput input);
    /// <summary>
    /// Xử lý tin nhắn WeChat doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Tài liệu tham khảo: <see cref="https://developer.work.weixin.qq.com/document/path/90238"/>
    /// </remarks>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<string> Handle(MessageHandleInput input);
}
