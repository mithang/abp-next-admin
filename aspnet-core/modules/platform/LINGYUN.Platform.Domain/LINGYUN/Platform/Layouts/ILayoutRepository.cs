using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace LINGYUN.Platform.Layouts;

public interface ILayoutRepository : IBasicRepository<Layout, Guid>
{
    /// <summary>
    /// Truy vấn bố cục theo tên
    /// </summary>
    /// <param name="name"></param>
    /// <param name="includeDetails"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Layout?> FindByNameAsync(
        string name,
        bool includeDetails = true,
        CancellationToken cancellationToken = default);

    Task<int> GetCountAsync(
        string? framework = null,
        string? filter = null,
        CancellationToken cancellationToken = default);

    Task<List<Layout>> GetPagedListAsync(
        string? framework = null,
        string? filter = null,
        string? sorting = nameof(Layout.Name),
        bool includeDetails = false,
        int skipCount = 0,
        int maxResultCount = 10,
        CancellationToken cancellationToken = default);
}
