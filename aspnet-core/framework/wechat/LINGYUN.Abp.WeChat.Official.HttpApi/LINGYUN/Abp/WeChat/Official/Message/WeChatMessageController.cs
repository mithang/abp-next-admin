using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;

namespace LINGYUN.Abp.WeChat.Official.Message;

/// <summary>
/// Giao diện xử lý tin nhắn tài khoản chính thức WeChat
/// </summary>
/// <remarks>
/// Chi tiết xem tài liệu tài khoản chính thức WeChat: <seealso cref="https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html"/>
/// </remarks>
[Controller]
[RemoteService(Name = AbpWeChatOfficialRemoteServiceConsts.RemoteServiceName)]
[Area(AbpWeChatOfficialRemoteServiceConsts.ModuleName)]
[Route("api/wechat/official/messages")]
public class WeChatMessageController : AbpControllerBase, IWeChatMessageAppService
{
    private readonly IWeChatMessageAppService _service;

    public WeChatMessageController(IWeChatMessageAppService service)
    {
        _service = service;
    }
    /// <summary>
    /// Giao diện callback xác minh tin nhắn máy chủ tài khoản chính thức WeChat<br />
    /// Xác minh tính hợp lệ của tin nhắn do máy chủ tài khoản chính thức WeChat gửi
    /// </summary>
    /// <param name="input">Tham số tin nhắn xác minh do máy chủ tài khoản chính thức WeChat truyền</param>
    /// <returns></returns>
    [HttpGet]
    public virtual Task<string> Handle([FromQuery] MessageValidationInput input)
    {
        return _service.Handle(input);
    }

    /// <summary>
    /// Giao diện callback tin nhắn nghiệp vụ máy chủ tài khoản chính thức WeChat<br />
    /// Xử lý tin nhắn nghiệp vụ do máy chủ tài khoản chính thức WeChat gửi
    /// </summary>
    /// <param name="input">Tham số tin nhắn do máy chủ tài khoản chính thức WeChat truyền</param>
    /// <returns></returns>
    [HttpPost]
    public async virtual Task<string> Handle([FromQuery] MessageHandleInput input)
    {
        using var reader = new StreamReader(Request.Body, Encoding.UTF8);
        var content = await reader.ReadToEndAsync();

        input.Data = content;

        return await _service.Handle(input);
    }
}
