using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Request;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers;
/// <summary>
/// Giao diện kế thừa khi nghỉ việc
/// </summary>
public interface IWeChatWorkResignExtendProvider
{
    /// <summary>
    /// Lấy danh sách thành viên đã nghỉ việc chờ phân công
    /// </summary>
    /// <remarks>
    /// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92124"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetUnassignedListResponse> GetUnassignedListAsync(
        WeChatWorkGetUnassignedListRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Phân công khách hàng của thành viên đã nghỉ việc
    /// </summary>
    /// <remarks>
    /// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/94081"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResignedTransferCustomerResponse> ResignedTransferCustomerAsync(
        WeChatWorkResignedTransferCustomerRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Tra cứu trạng thái tiếp nhận khách hàng
    /// </summary>
    /// <remarks>
    /// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/94082"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetResignedTransferResultResponse> GetResignedTransferResultAsync(
        WeChatWorkGetResignedTransferResultRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Phân công nhóm khách hàng của thành viên đã nghỉ việc
    /// </summary>
    /// <remarks>
    /// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92127"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGroupChatTransferResponse> GroupChatTransferAsync(
        WeChatWorkGroupChatTransferRequest request,
        CancellationToken cancellationToken = default);
}
