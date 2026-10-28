using System.Threading.Tasks;

namespace LINGYUN.Abp.Gdpr;
/// <summary>
/// Nhà cung cấp tài khoản cá nhân của người dùng
/// </summary>
public interface IGdprUserAccountProvider
{
    /// <summary>
    /// Tên nhà cung cấp
    /// </summary>
    string Name { get; }
    /// <summary>
    /// Xóa tài khoản người dùng
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    Task DeleteAsync(GdprDeleteUserAccountContext context);
}
