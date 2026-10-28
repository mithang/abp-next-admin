using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Exporter;
/// <summary>
/// Xuất dữ liệu Excel
/// </summary>
public interface IExcelExporterProvider
{
    /// <summary>
    /// Xuất dữ liệu
    /// </summary>
    /// <param name="data">Dữ liệu xuất</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Stream> ExportAsync(object data, CancellationToken cancellationToken = default);
}
