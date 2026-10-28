using LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Request;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Tags.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Tags;
/// <summary>
/// Quản lý nhãn khách hàng
/// </summary>
public interface IWeChatWorkCropTagProvider
{
    /// <summary>
    /// Lấy kho nhãn doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E8%8E%B7%E5%8F%96%E4%BC%81%E4%B8%9A%E6%A0%87%E7%AD%BE%E5%BA%93" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetCropTagListResponse> GetCropTagListAsync(
        WeChatWorkGetCropTagListRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thêm nhãn khách hàng doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E6%B7%BB%E5%8A%A0%E4%BC%81%E4%B8%9A%E5%AE%A2%E6%88%B7%E6%A0%87%E7%AD%BE" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkCreateCropTagResponse> CreateCropTagAsync(
        WeChatWorkCreateCropTagRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Sửa nhãn khách hàng doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E7%BC%96%E8%BE%91%E4%BC%81%E4%B8%9A%E5%AE%A2%E6%88%B7%E6%A0%87%E7%AD%BE" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> UpdateCropTagAsync(
        WeChatWorkUpdateCropTagRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa nhãn khách hàng doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92117#%E5%88%A0%E9%99%A4%E4%BC%81%E4%B8%9A%E5%AE%A2%E6%88%B7%E6%A0%87%E7%AD%BE" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> DeleteCropTagAsync(
        WeChatWorkDeleteCropTagRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Sửa nhãn doanh nghiệp của khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92118" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> MarkCropTagAsync(
        WeChatWorkMarkCropTagRequest request,
        CancellationToken cancellationToken = default);
}
