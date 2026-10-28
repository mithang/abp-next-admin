using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Auditing;

namespace LINGYUN.Abp.WeChat.Work.Authorize;

/// <summary>
/// Ủy quyền web WeChat Doanh nghiệp
/// </summary>
/// <remarks>
/// Xem chi tiết trong tài liệu WeChat Doanh nghiệp: <see cref="https://developer.work.weixin.qq.com/document/path/91335"/>
/// </remarks>
[Controller]
[DisableAuditing]
//[RemoteService(false)]
//[ApiExplorerSettings(IgnoreApi = true)]
[RemoteService(Name = AbpWeChatWorkRemoteServiceConsts.RemoteServiceName)]
[Area(AbpWeChatWorkRemoteServiceConsts.ModuleName)]
[Route("api/wechat/work/authorize")]
public class WeChatWorkAuthorizeController : AbpControllerBase, IWeChatWorkAuthorizeAppService
{
    private readonly IWeChatWorkAuthorizeAppService _service;

    public WeChatWorkAuthorizeController(IWeChatWorkAuthorizeAppService service)
    {
        _service = service;
    }

    /// <summary>
    /// Tạo liên kết ủy quyền web
    /// </summary>
    /// <remarks>
    /// Xem chi tiết trong tài liệu WeChat Doanh nghiệp: <see cref="https://developer.work.weixin.qq.com/document/path/91022"/>
    /// </remarks>
    /// <param name="urlName">Tên Url gọi lại ủy quyền</param>
    /// <param name="responseType">Loại phản hồi oauth</param>
    /// <param name="scope">Phạm vi ủy quyền oauth</param>
    /// <returns></returns>
    [HttpGet]
    [Authorize]
    [Route("oauth2/generate")]
    public virtual Task<string> GenerateOAuth2AuthorizeAsync(
        [FromQuery] string urlName,
        [FromQuery(Name = "response_type")] string responseType = "code",
        [FromQuery] string scope = "snsapi_base")
    {
        return _service.GenerateOAuth2AuthorizeAsync(responseType, scope);
    }

    /// <summary>
    /// Tạo liên kết ủy quyền web
    /// </summary>
    /// <remarks>
    /// Xem chi tiết trong tài liệu WeChat Doanh nghiệp: <see cref="https://developer.work.weixin.qq.com/document/path/91022"/>
    /// </remarks>
    /// <param name="urlName">Tên Url gọi lại ủy quyền</param>
    /// <param name="responseType">Loại phản hồi oauth</param>
    /// <param name="scope">Phạm vi ủy quyền oauth</param>
    /// <returns></returns>
    [HttpGet]
    [Authorize]
    [Route("oauth2")]
    public async virtual Task<IActionResult> OAuth2AuthorizeAsync(
        [FromQuery] string urlName,
        [FromQuery(Name = "response_type")] string responseType = "code",
        [FromQuery] string scope = "snsapi_base")
    {
        var url = await _service.GenerateOAuth2AuthorizeAsync(urlName, responseType, scope);

        return Redirect(url);
    }

    /// <summary>
    /// Tạo liên kết đăng nhập WeChat Doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Xem chi tiết trong tài liệu WeChat Doanh nghiệp: <see cref="https://developer.work.weixin.qq.com/document/path/98152#api%E6%8E%A5%E5%8F%A3"/>
    /// </remarks>
    /// <param name="urlName">Tên Url gọi lại ủy quyền</param>
    /// <param name="loginType">Loại đăng nhập, ServiceApp: đăng nhập nhà cung cấp dịch vụ; CorpApp: đăng nhập ứng dụng tự xây dựng/đại diện phát triển của doanh nghiệp</param>
    /// <returns></returns>
    [HttpGet]
    [Authorize]
    [Route("oauth2/login/generate")]
    public virtual Task<string> GenerateOAuth2LoginAsync(
        string urlName,
        string loginType = "CorpApp")
    {
        return _service.GenerateOAuth2LoginAsync(urlName, loginType);
    }

    /// <summary>
    /// Tạo liên kết đăng nhập WeChat Doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Xem chi tiết trong tài liệu WeChat Doanh nghiệp: <see cref="https://developer.work.weixin.qq.com/document/path/98152#api%E6%8E%A5%E5%8F%A3"/>
    /// </remarks>
    /// <param name="urlName">Tên Url gọi lại ủy quyền</param>
    /// <param name="loginType">Loại đăng nhập, ServiceApp: đăng nhập nhà cung cấp dịch vụ; CorpApp: đăng nhập ứng dụng tự xây dựng/đại diện phát triển của doanh nghiệp</param>
    /// <returns></returns>
    [HttpGet]
    [Authorize]
    [Route("oauth2/login")]
    public async virtual Task<IActionResult> OAuth2LoginAsync(
        string urlName,
        string loginType = "CorpApp")
    {
        var url = await _service.GenerateOAuth2LoginAsync(urlName, loginType);

        return Redirect(url);
    }
}
