using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Auditing;

namespace LINGYUN.Abp.WeChat.Work.Message;

/// <summary>
/// Giao diện xử lý tin nhắn WeChat Work doanh nghiệp
/// </summary>
/// <remarks>
/// Chi tiết xem tài liệu WeChat Work doanh nghiệp: <seealso cref="https://developer.work.weixin.qq.com/document/path/90930"/>
/// </remarks>
[Controller]
[DisableAuditing]
[RemoteService(Name = AbpWeChatWorkRemoteServiceConsts.RemoteServiceName)]
[Area(AbpWeChatWorkRemoteServiceConsts.ModuleName)]
[Route("api/wechat/work/messages")]
public class WeChatWorkMessageController : AbpControllerBase, IWeChatWorkMessageAppService
{
    private readonly IWeChatWorkMessageAppService _service;

    public WeChatWorkMessageController(IWeChatWorkMessageAppService service)
    {
        _service = service;
    }

    /// <summary>
    /// Giao diện callback xác minh tin nhắn từ máy chủ WeChat Work doanh nghiệp<br />
    /// Xác minh tính hợp lệ của tin nhắn do WeChat Work doanh nghiệp gửi
    /// </summary>
    /// <param name="agentId">Định danh ứng dụng nội bộ của doanh nghiệp</param>
    /// <param name="input">Tham số tin nhắn xác minh do máy chủ WeChat Work doanh nghiệp truyền tới</param>
    /// <returns></returns>
    [HttpGet]
    public virtual Task<string> Handle([FromQuery] MessageValidationInput input)
    {
        return _service.Handle(input);
    }

    /// <summary>
    /// Giao diện callback tin nhắn nghiệp vụ từ máy chủ WeChat Work doanh nghiệp<br />
    /// Xử lý tin nhắn nghiệp vụ do máy chủ WeChat Work doanh nghiệp gửi
    /// </summary>
    /// <param name="agentId">Định danh ứng dụng nội bộ của doanh nghiệp</param>
    /// <param name="input">Tham số tin nhắn do máy chủ WeChat Work doanh nghiệp truyền tới</param>
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
