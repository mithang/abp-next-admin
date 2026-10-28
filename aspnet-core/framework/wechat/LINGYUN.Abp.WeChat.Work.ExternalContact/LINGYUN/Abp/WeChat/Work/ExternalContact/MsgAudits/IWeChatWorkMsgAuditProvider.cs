using LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Request;
using LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits;
/// <summary>
/// Giao diện lưu trữ phiên trò chuyện
/// </summary>
public interface IWeChatWorkMsgAuditProvider
{
    /// <summary>
    /// Lấy danh sách thành viên đã bật lưu trữ nội dung phiên trò chuyện
    /// </summary>
    /// <remarks>
    /// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/91614" />
    /// </remarks>
    Task<WeChatWorkGetPermitUserListResponse> GetPermitUserListAsync(
        WeChatWorkGetPermitUserListRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy tình trạng đồng ý của phiên trò chuyện riêng
    /// </summary>
    /// <remarks>
    /// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/91782" />
    /// </remarks>
    Task<WeChatWorkCheckSingleAgreeResponse> CheckSingleAgreeAsync(
        WeChatWorkCheckSingleAgreeRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy tình trạng đồng ý của phiên trò chuyện nhóm
    /// </summary>
    /// <remarks>
    /// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/91782" />
    /// </remarks>
    Task<WeChatWorkCheckRoomAgreeResponse> CheckRoomAgreeAsync(
        WeChatWorkCheckRoomAgreeRequest request,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy thông tin nhóm nội bộ của lưu trữ nội dung phiên trò chuyện
    /// </summary>
    /// <remarks>
    /// Chi tiết xem tại: <see href="https://developer.work.weixin.qq.com/document/path/92951" />
    /// </remarks>
    Task<WeChatWorkGetGroupChatResponse> GetGroupChatAsync(
        WeChatWorkGetGroupChatRequest request,
        CancellationToken cancellationToken = default);
}
