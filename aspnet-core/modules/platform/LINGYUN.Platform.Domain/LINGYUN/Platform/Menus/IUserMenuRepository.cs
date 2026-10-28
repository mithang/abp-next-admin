using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace LINGYUN.Platform.Menus;

public interface IUserMenuRepository : IBasicRepository<UserMenu, Guid>
{
    /// <summary>
    /// Người dùng có sở hữu menu hay không
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="menuName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> UserHasInMenuAsync(
        Guid userId,
        string menuName,
        CancellationToken cancellationToken = default);

    Task<List<UserMenu>> GetListByUserIdAsync(
        Guid userId,
        string? framework = null,
        CancellationToken cancellationToken = default);

    Task<Menu?> FindStartupMenuAsync(
        Guid userId,
        string? framework = null,
        CancellationToken cancellationToken = default);
}
