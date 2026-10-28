using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.WeChat.Work.Authorize;
public interface IWeChatWorkAuthorizeAppService : IApplicationService
{
    /// <summary>
    /// Tạo liên kết ủy quyền
    /// </summary>
    /// <param name="urlName">Tên Url gọi lại ủy quyền</param>
    /// <param name="responseType">Kiểu phản hồi</param>
    /// <param name="scope">Phạm vi ủy quyền</param>
    /// <returns></returns>
    Task<string> GenerateOAuth2AuthorizeAsync(
        string urlName,
        string responseType = "code",
        string scope = "snsapi_base");
    /// <summary>
    /// Tạo liên kết đăng nhập
    /// </summary>
    /// <param name="urlName">Tên Url gọi lại ủy quyền</param>
    /// <param name="loginType">Kiểu đăng nhập</param>
    /// <returns></returns>
    Task<string> GenerateOAuth2LoginAsync(
        string urlName,
        string loginType = "CorpApp");
}
