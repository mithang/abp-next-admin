using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace LINGYUN.Abp.DataProtection;
/// <summary>
/// Bộ xây dựng giá trị trả về của thuộc tính thực thể
/// </summary>
public interface IEntityPropertyResultBuilder
{
    /// <summary>
    /// Lấy biểu thức lọc giá trị trả về của thuộc tính thực thể
    /// </summary>
    /// <typeparam name="TEntity">Kiểu thực thể</typeparam>
    /// <param name="operation">Phương thức thao tác dữ liệu</param>
    /// <returns></returns>
    Task<Expression<Func<TEntity, TEntity>>> Build<TEntity>(DataAccessOperation operation);
    /// <summary>
    /// Lấy biểu thức lọc giá trị trả về của thuộc tính thực thể
    /// </summary>
    /// <param name="entityType">Kiểu thực thể</param>
    /// <param name="operation">Phương thức thao tác dữ liệu</param>
    /// <returns></returns>
    Task<LambdaExpression> Build(Type entityType, DataAccessOperation operation);
}
