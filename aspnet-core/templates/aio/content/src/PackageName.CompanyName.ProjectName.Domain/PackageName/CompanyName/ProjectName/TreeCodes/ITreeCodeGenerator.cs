using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;

namespace PackageName.CompanyName.ProjectName.TreeCodes
{
    /// <summary>
    /// Giao diện bộ sinh mã cây
    /// </summary>
    public interface ITreeCodeGenerator
    {
        /// <summary>
        /// Tạo mã cây
        /// </summary>
        /// <typeparam name="TEntity">Loại thực thể</typeparam>
        /// <param name="repository">Kho lưu trữ</param>
        /// <param name="parentId">Id cấp cha</param>
        /// <returns>Mã cây đã tạo</returns>
        Task<string> GenerateAsync<TEntity>(
            IRepository<TEntity, Guid> repository,
            Guid? parentId)
            where TEntity : class, IEntity<Guid>, IHaveTreeCode;

        /// <summary>
        /// Cập nhật TreeCode của nút và tất cả các nút con của nó
        /// </summary>
        Task UpdateTreeCodesAsync<TEntity>(
            IRepository<TEntity, Guid> repository,
            Guid entityId)
            where TEntity : class, IEntity<Guid>, IHaveTreeCode;
    }
}
