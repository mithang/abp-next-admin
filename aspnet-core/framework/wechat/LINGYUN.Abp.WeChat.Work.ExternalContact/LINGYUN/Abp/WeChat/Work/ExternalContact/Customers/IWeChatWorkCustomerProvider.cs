using LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Request;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers;
/// <summary>
/// Giao diện quản lý khách hàng
/// </summary>
public interface IWeChatWorkCustomerProvider
{
    /// <summary>
    /// Lấy danh sách khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92113" />
    /// </remarks>
    /// <param name="userId">userid của thành viên doanh nghiệp</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetCustomerListResponse> GetCustomerListAsync(
        string userId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy hàng loạt chi tiết khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92994" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkBulkGetCustomerResponse> BulkGetCustomerAsync(
        WeChatWorkBulkGetCustomerRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92114" />
    /// </remarks>
    /// <param name="externalUserid">userid của liên hệ bên ngoài, lưu ý không phải tài khoản của thành viên doanh nghiệp</param>
    /// <param name="cursor">next_cursor mà lần yêu cầu trước trả về</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetCustomerResponse> GetCustomerAsync(
        string externalUserid, 
        string? cursor = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Sửa thông tin ghi chú của khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92115" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> UpdateCustomerRemarkAsync(
        WeChatWorkUpdateCustomerRemarkRequest request,
        CancellationToken cancellationToken = default);
}
