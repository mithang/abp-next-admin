using LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
using LINGYUN.Abp.WeChat.Work.Contacts.Members.Request;
using LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members;
/// <summary>
/// Giao diện quản lý thành viên WeChat doanh nghiệp
/// </summary>
public interface IWeChatWorkMemberProvider
{
    /// <summary>
    /// Đọc thành viên
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90196" />
    /// </remarks>
    /// <param name="userId">UserID của thành viên. Tương ứng với tài khoản phía quản trị, phải duy nhất trong doanh nghiệp. Không phân biệt chữ hoa/thường, độ dài 1~64 byte</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetMemberResponse> GetMemberAsync(
        string userId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Tạo thành viên
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90195" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkCreateMemberResponse> CreateMemberAsync(
        WeChatWorkCreateMemberRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Cập nhật thành viên
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90197" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> UpdateMemberAsync(
        WeChatWorkUpdateMemberRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa thành viên
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90198" />
    /// </remarks>
    /// <param name="userId">UserID của thành viên. Tương ứng với tài khoản phía quản trị</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> DeleteMemberAsync(
        string userId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa hàng loạt thành viên
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90199" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> BulkDeleteMemberAsync(
        WeChatWorkBulkDeleteMemberRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy thành viên của phòng ban
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90200" />
    /// </remarks>
    /// <param name="departmentId">id phòng ban cần lấy</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetSimpleMemberListResponse> GetSimpleMemberListAsync(
        int departmentId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết thành viên của phòng ban
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90201" />
    /// </remarks>
    /// <param name="departmentId">id phòng ban cần lấy</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetMemberListResponse> GetMemberListAsync(
        int departmentId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Chuyển userid thành openid
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90202" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkConvertToOpenIdResponse> ConvertToOpenIdAsync(
        WeChatWorkConvertToOpenIdRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Chuyển openid thành userid
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90202" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkConvertToUserIdResponse> ConvertToUserIdAsync(
        WeChatWorkConvertToUserIdRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xác minh lần hai khi đăng nhập
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90203" />
    /// </remarks>
    /// <param name="userId">UserID của thành viên. Tương ứng với tài khoản phía quản trị</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkResponse> AuthSuccessAsync(
        string userId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Mời thành viên
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90975" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkBulkInviteMemberResponse> BulkInviteMemberAsync(
        WeChatWorkBulkInviteMemberRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy mã QR tham gia doanh nghiệp
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/91714" />
    /// </remarks>
    /// <param name="sizeType">Loại kích thước mã QR</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetJoinQrCodeResponse> GetJoinQrCodeAsync(
        QrCodeSizeType sizeType,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy userid bằng số điện thoại di động
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/95402" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetUserIdResponse> GetUserIdByMobileAsync(
        WeChatWorkGetUserIdByMobileRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy userid bằng email
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/95895" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetUserIdResponse> GetUserIdByEmailAsync(
        WeChatWorkGetUserIdByEmailRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách ID thành viên
    /// </summary>
    /// <remarks>
    /// Giao diện này sử dụng Token ứng dụng danh bạ<br />
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/96067" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetUserIdListResponse> GetUserIdListAsync(
        WeChatWorkGetUserIdListRequest request,
        CancellationToken cancellationToken = default);
}
