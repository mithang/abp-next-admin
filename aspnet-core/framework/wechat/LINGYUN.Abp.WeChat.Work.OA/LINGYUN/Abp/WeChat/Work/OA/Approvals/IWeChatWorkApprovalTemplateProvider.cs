using LINGYUN.Abp.WeChat.Work.OA.Approvals.Request;
using LINGYUN.Abp.WeChat.Work.OA.Approvals.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals;
/// <summary>
/// Giao diện mẫu phê duyệt
/// </summary>
/// <remarks>
/// Xem chi tiết tại: https://developer.work.weixin.qq.com/document/path/91854
/// </remarks>
public interface IWeChatWorkApprovalTemplateProvider
{
    /// <summary>
    /// Tạo mẫu phê duyệt
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:https://developer.work.weixin.qq.com/document/path/97437
    /// </remarks>
    /// <param name="request">Tham số yêu cầu tạo mẫu phê duyệt</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi tạo mẫu phê duyệt</returns>
    Task<WeChatWorkCreateTemplateResponse> CreateTemplateAsync(
        WeChatWorkCreateTemplateRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Cập nhật mẫu phê duyệt
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:https://developer.work.weixin.qq.com/document/path/97438
    /// </remarks>
    /// <param name="request">Tham số yêu cầu cập nhật mẫu phê duyệt</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi cập nhật mẫu phê duyệt</returns>
    Task<WeChatWorkResponse> UpdateTemplateAsync(
        WeChatWorkCreateTemplateRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết mẫu phê duyệt
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:https://developer.work.weixin.qq.com/document/path/91982
    /// </remarks>
    /// <param name="request">Tham số yêu cầu lấy mẫu phê duyệt</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi mẫu phê duyệt</returns>
    Task<WeChatWorkTemplateResponse> GetTemplateAsync(
        WeChatWorkGetTemplateRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy hàng loạt số đơn phê duyệt
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:https://developer.work.weixin.qq.com/document/path/91816
    /// </remarks>
    /// <param name="request">Tham số yêu cầu lấy hàng loạt số đơn phê duyệt</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi lấy hàng loạt số đơn phê duyệt</returns>
    Task<WeChatWorkGetApprovalInfoResponse> GetApprovalInfoAsync(
        WeChatWorkGetApprovalInfoRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết đơn xin phê duyệt
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:https://developer.work.weixin.qq.com/document/path/91983
    /// </remarks>
    /// <param name="request">Tham số yêu cầu lấy chi tiết đơn xin phê duyệt</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi lấy chi tiết đơn xin phê duyệt</returns>
    Task<WeChatWorkGetApprovalDetailResponse> GetApprovalDetailAsync(
        WeChatWorkGetApprovalDetailRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Gửi đơn xin phê duyệt
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại:https://developer.work.weixin.qq.com/document/path/91853
    /// </remarks>
    /// <param name="request">Tham số yêu cầu gửi đơn xin phê duyệt</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi gửi đơn xin phê duyệt</returns>
    Task<WeChatWorkApplyEventResponse> ApplyEventAsync(
        WeChatWorkApplyEventRequest request,
        CancellationToken cancellationToken = default);
}
