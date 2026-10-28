using LINGYUN.Abp.DataProtection;
using LINGYUN.Abp.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Specifications;

namespace PackageName.CompanyName.ProjectName.EntityFrameworkCore;
/// <summary>
/// Triển khai giao diện cơ bản
/// </summary>
/// <typeparam name="TEntity">Kiểu thực thể</typeparam>
/// <typeparam name="TKey">Kiểu khóa chính của thực thể</typeparam>
/// <typeparam name="TEntityAuth">Kiểu quyền dữ liệu của thực thể/typeparam>
public abstract class EfCoreProjectNameDataProtectionRepository<TEntity, TKey, TEntityAuth> :
    EfCoreDataProtectionRepository<IProjectNameDbContext, TEntity, TKey, TEntityAuth>,
    IProjectNameDataProtectionRepository<TEntity, TKey>
    where TEntity : class, IEntity<TKey>, IDataProtected 
    where TEntityAuth : DataAuthBase<TEntity, TKey>
{
    protected EfCoreProjectNameDataProtectionRepository(
        IDbContextProvider<IProjectNameDbContext> dbContextProvider,
        IDataAuthorizationService dataAuthorizationService, 
        IEntityTypeFilterBuilder entityTypeFilterBuilder, 
        IEntityPropertyResultBuilder entityPropertyResultBuilder) 
        : base(dbContextProvider, dataAuthorizationService, entityTypeFilterBuilder, entityPropertyResultBuilder)
    {
    }

    public async virtual Task<int> GetCountAsync(
        ISpecification<TEntity> specification, 
        CancellationToken cancellationToken = default)
    {
        return await (await GetQueryableAsync())
            .Where(specification.ToExpression())
            .CountAsync(GetCancellationToken(cancellationToken));
    }

    public async virtual Task<List<TEntity>> GetListAsync(
        ISpecification<TEntity> specification,
        string? sorting = nameof(IEntity<TKey>.Id), 
        int maxResultCount = 10,
        int skipCount = 0, 
        CancellationToken cancellationToken = default)
    {
        return await (await GetQueryableAsync())
              .Where(specification.ToExpression())
              .OrderBy(GetSortingOrDefault(sorting))
              .PageBy(skipCount, maxResultCount)
              .ToListAsync(GetCancellationToken(cancellationToken));
    }

    protected virtual string GetSortingOrDefault(string? sorting = nameof(IEntity<TKey>.Id))
    {
        if (sorting.IsNullOrWhiteSpace())
        {
            return nameof(IEntity<TKey>.Id);
        }
        return sorting;
    }
}
