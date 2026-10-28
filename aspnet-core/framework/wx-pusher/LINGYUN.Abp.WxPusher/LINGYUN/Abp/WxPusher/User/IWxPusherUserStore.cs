using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WxPusher.User;

public interface IWxPusherUserStore
{
    /// <summary>
    /// Lấy danh sách topic mà người dùng đã đăng ký
    /// </summary>
    /// <param name="userIds">Danh sách định danh người dùng</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<int>> GetSubscribeTopicsAsync(
        IEnumerable<Guid> userIds,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách uid người dùng đã liên kết
    /// </summary>
    /// <param name="userIds"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<string>> GetBindUidsAsync(
        IEnumerable<Guid> userIds,
        CancellationToken cancellationToken = default);
}
