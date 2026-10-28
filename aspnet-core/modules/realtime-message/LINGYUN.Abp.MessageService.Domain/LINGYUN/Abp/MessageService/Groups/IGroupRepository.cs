using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace LINGYUN.Abp.MessageService.Groups;

public interface IGroupRepository : IBasicRepository<ChatGroup, long>
{
    /// <summary>
    /// Người dùng có bị chặn hay không
    /// </summary>
    /// <param name="id"></param>
    /// <param name="formUserId"></param>
    /// <returns></returns>
    Task<bool> UserHasBlackedAsync(
        long id,
        Guid formUserId,
        CancellationToken cancellationToken = default);

    Task<ChatGroup?> FindByIdAsync(
        long id,
        CancellationToken cancellationToken = default);

    Task<List<UserGroupCard>> GetGroupAdminAsync(
        long id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Lấy số lượng nhóm
    /// </summary>
    /// <param name="filter"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> GetCountAsync(
        string? filter = null,
        bool allowAnonymousOnly = false,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách nhóm
    /// </summary>
    /// <param name="filter"></param>
    /// <param name="sorting"></param>
    /// <param name="skipCount"></param>
    /// <param name="maxResultCount"></param>
    /// <param name="allowAnonymousOnly">SEC-04: chỉ lấy group cho phép trò chuyện ẩn danh (dành cho request ẩn danh)</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<ChatGroup>> GetListAsync(
        string? filter = null,
        string? sorting = nameof(ChatGroup.Name),
        int skipCount = 0,
        int maxResultCount = 10,
        bool allowAnonymousOnly = false,
        CancellationToken cancellationToken = default);
}
