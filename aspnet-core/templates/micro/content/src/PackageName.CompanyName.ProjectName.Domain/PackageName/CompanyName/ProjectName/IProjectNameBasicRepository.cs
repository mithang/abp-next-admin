using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Specifications;

namespace PackageName.CompanyName.ProjectName;
/// <summary>
/// Giao diện kho lưu trữ thực thể
/// </summary>
/// <typeparam name="TEntity">Kiểu thực thể</typeparam>
/// <typeparam name="TKey">Kiểu khóa chính của thực thể</typeparam>
public interface IProjectNameBasicRepository<TEntity, TKey> : IBasicRepository<TEntity, TKey>
    where TEntity : class, IEntity<TKey>
{
    /// <summary>
    /// Lấy số lượng thực thể sau khi lọc
    /// </summary>
    /// <param name="specification"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> GetCountAsync(
        ISpecification<TEntity> specification,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách thực thể sau khi lọc (phân trang)
    /// </summary>
    /// <param name="specification"></param>
    /// <param name="sorting"></param>
    /// <param name="maxResultCount"></param>
    /// <param name="skipCount"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<TEntity>> GetListAsync(
        ISpecification<TEntity> specification,
        string? sorting = nameof(IEntity<TKey>.Id),
        int maxResultCount = 10,
        int skipCount = 0,
        CancellationToken cancellationToken = default);
}
