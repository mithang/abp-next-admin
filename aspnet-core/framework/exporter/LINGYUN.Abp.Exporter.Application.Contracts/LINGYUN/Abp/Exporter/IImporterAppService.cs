using System.Threading.Tasks;

namespace LINGYUN.Abp.Exporter;
/// <summary>
/// Giao diện dịch vụ nhập dữ liệu
/// </summary>
/// <typeparam name="TEntityImportDto"></typeparam>
public interface IImporterAppService<TEntityImportDto>
    where TEntityImportDto: class, new()
{
    /// <summary>
    /// Nhập dữ liệu (mặc định từ Excel)
    /// </summary>
    /// <param name="input">Luồng tệp dữ liệu được nhập</param>
    /// <returns></returns>
    Task ImportAsync(TEntityImportDto input);
}
