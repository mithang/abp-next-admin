using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Request;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers;
/// <summary>
/// Giao diện kế thừa khi đang tại chức
/// </summary>
public interface IWeChatWorkEmployExtendProvider
{
    /// <summary>
    /// Phân bổ khách hàng của thành viên đang tại chức
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92124"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkTransferCustomerResponse> TransferCustomerAsync(
        WeChatWorkTransferCustomerRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn trạng thái tiếp nhận khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/94088"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetTransferResultResponse> GetTransferResultAsync(
        WeChatWorkGetTransferResultRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Phân bổ nhóm khách hàng của thành viên đang tại chức
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/95703"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGroupChatOnjobTransferResponse> GroupChatOnjobTransferAsync(
        WeChatWorkGroupChatOnjobTransferRequest request,
        CancellationToken cancellationToken = default);
}
