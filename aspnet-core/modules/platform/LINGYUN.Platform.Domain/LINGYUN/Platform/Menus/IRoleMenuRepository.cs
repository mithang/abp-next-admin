using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace LINGYUN.Platform.Menus;

public interface IRoleMenuRepository : IBasicRepository<RoleMenu, Guid>
{
    /// <summary>
    /// Vai trò có sở hữu menu hay không
    /// </summary>
    /// <param name="roleName"></param>
    /// <param name="menuName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> RoleHasInMenuAsync(
        string roleName,
        string menuName,
        CancellationToken cancellationToken = default);

    Task<List<RoleMenu>> GetListByRoleNameAsync(
        string roleName,
        string? framework = null,
        CancellationToken cancellationToken = default);

    Task<Menu?> FindStartupMenuAsync(
        IEnumerable<string> roleNames,
        string? framework = null,
        CancellationToken cancellationToken = default);
}
