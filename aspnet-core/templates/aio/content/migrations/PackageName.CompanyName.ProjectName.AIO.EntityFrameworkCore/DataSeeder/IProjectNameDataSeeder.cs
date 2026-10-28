using System.Threading.Tasks;
using Volo.Abp.Data;

namespace PackageName.CompanyName.ProjectName.AIO.EntityFrameworkCore.DataSeeder
{
    public interface IProjectNameDataSeeder
    {
        /// <summary>
        /// Khởi tạo dữ liệu
        /// </summary>
        /// <param name="context">Ngữ cảnh seed dữ liệu</param>
        /// <returns>Tác vụ</returns>
        Task SeedAsync(DataSeedContext context);
    }
}
