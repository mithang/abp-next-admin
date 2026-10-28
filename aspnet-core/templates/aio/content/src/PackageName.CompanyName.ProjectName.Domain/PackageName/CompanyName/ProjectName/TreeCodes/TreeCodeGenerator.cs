using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;

namespace PackageName.CompanyName.ProjectName.TreeCodes
{
    /// <summary>
    /// Trình tạo mã dạng cây
    /// </summary>
    public class TreeCodeGenerator : ITreeCodeGenerator, ISingletonDependency
    {
        /// <summary>
        /// Tạo mã dạng cây
        /// </summary>
        /// <typeparam name="TEntity">Loại thực thể</typeparam>
        /// <param name="repository">Kho lưu trữ</param>
        /// <param name="parentId">Id cấp cha</param>
        /// <returns>Mã dạng cây đã tạo</returns>
        public async virtual Task<string> GenerateAsync<TEntity>(
            IRepository<TEntity, Guid> repository,
            Guid? parentId)
            where TEntity : class, IEntity<Guid>, IHaveTreeCode
        {
            if (!parentId.HasValue)
            {
                // Tạo mã nút gốc
                return await GenerateRootCodeAsync(repository);
            }
            else
            {
                // Tạo mã nút con
                return await GenerateChildCodeAsync(repository, parentId.Value);
            }
        }

        private async Task<string> GenerateRootCodeAsync<TEntity>(
            IRepository<TEntity, Guid> repository)
            where TEntity : class, IEntity<Guid>, IHaveTreeCode
        {
            var query = await repository.GetQueryableAsync();
            query = query.Where(e => e.ParentId == null).OrderByDescending(e => e.CreationTime);
            var maxCodeEntity = await repository.AsyncExecuter.FirstOrDefaultAsync(query);

            if (maxCodeEntity == null)
            {
                return "0001";
            }

            int maxCode = int.Parse(maxCodeEntity.TreeCode.Split('.').LastOrDefault("0"));
            return (maxCode + 1).ToString("D4");
        }

        private async Task<string> GenerateChildCodeAsync<TEntity>(
            IRepository<TEntity, Guid> repository,
            Guid parentId)
            where TEntity : class, IEntity<Guid>, IHaveTreeCode
        {
            var parent = await repository.GetAsync(parentId);
            if (parent == null)
            {
                throw new EntityNotFoundException(typeof(TEntity), parentId);
            }

            var query = await repository.GetQueryableAsync();
            query = query.Where(e => e.ParentId == parentId).OrderByDescending(e => e.CreationTime);
            var maxCodeEntity = await repository.AsyncExecuter.FirstOrDefaultAsync(query);

            string newCode;
            if (maxCodeEntity == null)
            {
                newCode = "0001";
            }
            else
            {
                int maxCode = int.Parse(maxCodeEntity.TreeCode.Split('.').Last());
                newCode = (maxCode + 1).ToString("D4");
            }

            // Xây dựng TreeCode đầy đủ: TreeCode cha.Mã mới
            return $"{parent.TreeCode}.{newCode}";
        }

        /// <summary>
        /// Cập nhật TreeCode của nút và tất cả các nút con của nó
        /// </summary>
        public async virtual Task UpdateTreeCodesAsync<TEntity>(
            IRepository<TEntity, Guid> repository,
            Guid entityId)
            where TEntity : class, IEntity<Guid>, IHaveTreeCode
        {
            var entity = await repository.GetAsync(entityId);
            var query = await repository.GetQueryableAsync();
            var children = await repository.AsyncExecuter.ToListAsync(
                query.Where(e => e.ParentId == entityId));

            foreach (var child in children)
            {
                // Lấy mã nút con (phần cuối của TreeCode) hoặc tạo mã mới
                string childCode = child.TreeCode.Contains('.')
                    ? child.TreeCode.Split('.').Last()
                    : child.TreeCode;

                child.TreeCode = $"{entity.TreeCode}.{childCode}";
                await repository.UpdateAsync(child);

                // Cập nhật đệ quy các nút con
                await UpdateTreeCodesAsync(repository, child.Id);
            }
        }
    }
}