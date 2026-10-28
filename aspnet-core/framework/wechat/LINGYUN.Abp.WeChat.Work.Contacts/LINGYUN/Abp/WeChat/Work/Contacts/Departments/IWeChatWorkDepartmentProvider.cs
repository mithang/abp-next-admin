using LINGYUN.Abp.WeChat.Work.Contacts.Departments.Request;
using LINGYUN.Abp.WeChat.Work.Contacts.Departments.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments;
/// <summary>
/// Giao diện quản lý phòng ban WeChat Doanh nghiệp
/// </summary>
public interface IWeChatWorkDepartmentProvider
{
    /// <summary>
    /// Lấy danh sách phòng ban
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90208" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetDepartmentListResponse> GetDepartmentListAsync(
        WeChatWorkGetDepartmentListRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách ID phòng ban con
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/95350" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetSubDepartmentListResponse> GetSubDepartmentListAsync(
        WeChatWorkGetSubDepartmentListRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết một phòng ban
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/95351" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetDepartmentResponse> GetDepartmentAsync(
        WeChatWorkGetDepartmentRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Tạo phòng ban
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90205" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkCreateDepartmentResponse> CreateDepartmentAsync(
        WeChatWorkCreateDepartmentRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Cập nhật phòng ban
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90206" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> UpdateDepartmentAsync(
        WeChatWorkUpdateDepartmentRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa phòng ban
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90207" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> DeleteDepartmentAsync(
        WeChatWorkDeleteDepartmentRequest request,
        CancellationToken cancellationToken = default);
}
