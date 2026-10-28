using LINGYUN.Abp.WeChat.Work.ExternalContact.Follows.Response;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Follows;
/// <summary>
/// Giao diện quản lý nhân viên dịch vụ doanh nghiệp
/// </summary>
public interface IWeChatWorkFollowUserProvider
{
    /// <summary>
    /// Lấy danh sách thành viên đã cấu hình tính năng liên hệ khách hàng
    /// </summary>
    /// <remarks>
    /// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/92571" />
    /// </remarks>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WeChatWorkGetFollowUserListResponse> GetFollowUserListAsync(CancellationToken cancellationToken = default);
}
