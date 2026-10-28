using LINGYUN.Abp.WeChat.Work.Contacts.Tags.Request;
using LINGYUN.Abp.WeChat.Work.Contacts.Tags.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Tags;
/// <summary>
/// Giao diện quản lý nhãn
/// </summary>
public interface IWeChatWorkTagProvider
{
    /// <summary>
    /// Tạo nhãn
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90210"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu tạo nhãn</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi tạo nhãn</returns>
    Task<WeChatWorkTagCreateResponse> CreateAsync(
        WeChatWorkTagCreateRequest request, 
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Cập nhật tên nhãn
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90211"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu cập nhật tên nhãn</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi cập nhật tên nhãn</returns>
    Task<WeChatWorkResponse> UpdateAsync(
        WeChatWorkTagUpdateRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa nhãn
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90212"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu xóa nhãn</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi xóa nhãn</returns>
    Task<WeChatWorkResponse> DeleteAsync(
        WeChatWorkGetTagRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy thành viên của nhãn
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90213"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu lấy thành viên của nhãn</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi lấy thành viên của nhãn</returns>
    Task<WeChatWorkTagMemberInfoResponse> GetMemberAsync(
        WeChatWorkGetTagRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thêm thành viên vào nhãn
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90214"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu thêm thành viên vào nhãn</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi thêm thành viên vào nhãn</returns>
    Task<WeChatWorkTagChangeMemberResponse> AddMemberAsync(
        WeChatWorkTagChangeMemberRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa thành viên khỏi nhãn
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90215"/>
    /// </remarks>
    /// <param name="request">Tham số yêu cầu thêm thành viên vào nhãn</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi thêm thành viên vào nhãn</returns>
    Task<WeChatWorkTagChangeMemberResponse> DeleteMemberAsync(
        WeChatWorkTagChangeMemberRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách nhãn
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90216"/>
    /// </remarks>
    /// <param name="cancellationToken"></param>
    /// <returns>Tham số phản hồi lấy danh sách nhãn</returns>
    Task<WeChatWorkTagListResponse> GetListAsync(CancellationToken cancellationToken = default);
}
