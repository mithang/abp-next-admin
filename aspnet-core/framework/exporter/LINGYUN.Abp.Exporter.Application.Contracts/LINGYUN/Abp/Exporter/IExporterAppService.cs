using System.Threading.Tasks;
using Volo.Abp.Content;

namespace LINGYUN.Abp.Exporter;
/// <summary>
/// Giao diện dịch vụ xuất dữ liệu
/// </summary>
/// <typeparam name="TEntityExportDto">Đối tượng truyền dữ liệu thực thể được xuất</typeparam>
/// <typeparam name="TEntityListGetInput">Đối tượng dữ liệu lọc thực thể</typeparam>
public interface IExporterAppService<TEntityExportDto, TEntityListGetInput>
     where TEntityExportDto : class, new()
{
    /// <summary>
    /// Xuất dữ liệu (mặc định triển khai bằng Excel)
    /// </summary>
    /// <param name="input">Điều kiện lọc dữ liệu</param>
    /// <returns></returns>
    Task<IRemoteStreamContent> ExportAsync(TEntityListGetInput input);
}
