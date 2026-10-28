using LINGYUN.Abp.WeChat.Work.JsSdk.Models;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.JsSdk;
/// <summary>
/// Nhà cung cấp ticket tạm thời của JS-SDK
/// See: https://developer.work.weixin.qq.com/document/path/90506
/// </summary>
public interface IJsApiTicketProvider
{
    /// <summary>
    /// Lấy jsapi_ticket của doanh nghiệp
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<JsApiTicketInfo> GetTicketInfoAsync(CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy jsapi_ticket của ứng dụng
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<JsApiTicketInfo> GetAgentTicketInfoAsync(CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chữ ký JS-SDK
    /// </summary>
    /// <param name="ticketInfo">Ticket tạm thời của JS-SDK</param>
    /// <param name="url">URL dùng để tạo chữ ký</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    JsApiSignatureData GenerateSignature(JsApiTicketInfo ticketInfo, string url, CancellationToken cancellationToken = default);
}
