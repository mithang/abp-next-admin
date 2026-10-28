using LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Request;
using LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats;
/// <summary>
/// Giao diện quản lý nhóm khách hàng
/// </summary>
public interface IWeChatWorkGroupChatProvider
{
    /// <summary>
    /// Lấy danh sách nhóm khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92120" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetGroupChatListResponse> GetGroupChatListAsync(
        WeChatWorkGetGroupChatListRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết nhóm khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92122" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetGroupChatResponse> GetGroupChatAsync(
        WeChatWorkGetGroupChatRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Chuyển đổi opengid của nhóm khách hàng
    /// </summary>
    /// <remarks>
    /// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/94822" />
    /// </remarks>
    /// <param name="request">Tham số yêu cầu</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkOpengIdToChatIdResponse> OpengIdToChatIdAsync(
        WeChatWorkOpengIdToChatIdRequest request,
        CancellationToken cancellationToken = default);
}
