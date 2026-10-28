using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.PermissionManagement;

namespace LINGYUN.Abp.PermissionManagement;
public interface IMultiplePermissionManager : IPermissionManager
{
    /// <summary>
    /// Đặt quyền hàng loạt
    /// </summary>
    /// <param name="providerName">Nhà cung cấp quyền</param>
    /// <param name="providerKey">Key của nhà cung cấp quyền</param>
    /// <param name="permissions">Tập hợp quyền</param>
    /// <returns></returns>
    Task SetManyAsync(string providerName, string providerKey, IEnumerable<PermissionChangeState> permissions);
}
