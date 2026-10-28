using System.Threading.Tasks;

namespace LINGYUN.Abp.Gdpr;
/// <summary>
/// Nhà cung cấp dữ liệu cá nhân của người dùng<br />
/// Triển khai: https://abp.io/docs/latest/modules/gdpr#gdpruserdatarequestedeto
/// </summary>
public interface IGdprUserDataProvider
{
    /// <summary>
    /// Tên nhà cung cấp
    /// </summary>
    string Name { get; }
    /// <summary>
    /// Chuẩn bị dữ liệu người dùng
    /// </summary>
    Task PorepareAsync(GdprPrepareUserDataContext context);
    /// <summary>
    /// Xóa dữ liệu người dùng
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    Task DeleteAsync(GdprDeleteUserDataContext context);
}
