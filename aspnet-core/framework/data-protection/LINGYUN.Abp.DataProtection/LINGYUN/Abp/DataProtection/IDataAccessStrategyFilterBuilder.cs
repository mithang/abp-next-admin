using System.Linq;
using System.Threading.Tasks;

namespace LINGYUN.Abp.DataProtection;

/// <summary>
/// Bộ lọc chính sách quyền dữ liệu
/// </summary>
public interface IDataAccessStrategyFilterBuilder
{
    Task<DataAccessStrategyFilterBuildResult<TEntity>?> Build<TEntity, TKey, TEntityAuth>(
        IQueryable<TEntity> entity, 
        IQueryable<TEntityAuth> entityAuth)
        where TEntityAuth : DataAuthBase<TEntity, TKey>;
}
