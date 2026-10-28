using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace LINGYUN.Abp.DataProtection;
/// <summary>
/// Trình tạo điều kiện lọc thực thể
/// </summary>
public interface IEntityTypeFilterBuilder
{
    /// <summary>
    /// Lấy biểu thức lọc truy vấn của thực thể
    /// </summary>
    /// <param name="operation">Thao tác quyền dữ liệu</param>
    /// <param name="group">Nhóm điều kiện truy vấn</param>
    /// <typeparam name="TEntity">Kiểu thực thể</typeparam>
    /// <returns></returns>
    Task<Expression<Func<TEntity, bool>>> Build<TEntity>(DataAccessOperation operation, DataAccessFilterGroup? group = null);

    Task<LambdaExpression> Build(Type entityType, DataAccessOperation operation, DataAccessFilterGroup? group = null);
}