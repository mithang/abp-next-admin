using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.IM.Groups;

public interface IGroupStore
{
    /// <summary>
    /// Lấy thông tin nhóm
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="groupId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Group> GetAsync(
        Guid? tenantId,
        string groupId,
        bool allowAnonymousOnly = false,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy số lượng nhóm
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="filter"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> GetCountAsync(
        Guid? tenantId,
        string? filter = null,
        bool allowAnonymousOnly = false,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách nhóm
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="filter"></param>
    /// <param name="sorting"></param>
    /// <param name="skipCount"></param>
    /// <param name="maxResultCount"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<Group>> GetListAsync(
        Guid? tenantId,
        string? filter = null,
        string? sorting = nameof(Group.Name),
        int skipCount = 0,
        int maxResultCount = 10,
        bool allowAnonymousOnly = false,
        CancellationToken cancellationToken = default);
}
