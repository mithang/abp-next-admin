using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LINGYUN.Abp.DataProtection;
/// <summary>
/// Dịch vụ xác thực quyền dữ liệu
/// </summary>
public interface IDataAuthorizationService
{
    /// <summary>
    /// Xác thực quyền dữ liệu của thực thể cho thao tác
    /// </summary>
    /// <param name="operation">Thao tác quyền dữ liệu</param>
    /// <param name="entities">Danh sách thực thể cần kiểm tra</param>
    /// <typeparam name="TEntity">Kiểu thực thể</typeparam>
    /// <returns></returns>
    Task<AuthorizationResult> AuthorizeAsync<TEntity>(DataAccessOperation operation, IEnumerable<TEntity> entities);
}