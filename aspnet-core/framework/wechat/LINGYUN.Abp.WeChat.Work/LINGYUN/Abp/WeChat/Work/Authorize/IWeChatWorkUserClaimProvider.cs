using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Authorize;
/// <summary>
/// Nhà cung cấp danh tính người dùng WeChat Work
/// </summary>
public interface IWeChatWorkUserClaimProvider
{
    /// <summary>
    /// Truy vấn định danh người dùng WeChat Work theo định danh người dùng
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<string?> FindUserIdentifierAsync(
        Guid userId, 
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn danh sách định danh người dùng WeChat Work theo danh sách định danh người dùng
    /// </summary>
    /// <param name="userIdList"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<string>> FindUserIdentifierListAsync(
        IEnumerable<Guid> userIdList,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Liên kết WeChat Work của người dùng
    /// </summary>
    /// <param name="userId">Id người dùng</param>
    /// <param name="weChatUserId">Id người dùng WeChat Work</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task BindUserAsync(
        Guid userId,
        string weChatUserId,
        CancellationToken cancellationToken = default);
}
