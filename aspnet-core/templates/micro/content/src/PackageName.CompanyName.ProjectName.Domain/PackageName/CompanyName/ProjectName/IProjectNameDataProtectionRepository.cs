using LINGYUN.Abp.DataProtection;
using Volo.Abp.Domain.Entities;

namespace PackageName.CompanyName.ProjectName;
/// <summary>
/// Giao diện kho lưu trữ bảo vệ thực thể được bảo vệ
/// </summary>
/// <typeparam name="TEntity">Kiểu thực thể</typeparam>
/// <typeparam name="TKey">Kiểu khóa chính của thực thể</typeparam>
public interface IProjectNameDataProtectionRepository<TEntity, TKey> :
    IProjectNameBasicRepository<TEntity, TKey>,
    IDataProtectionRepository<TEntity>
    where TEntity : class, IEntity<TKey>
{
}
