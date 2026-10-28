using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Exporter;
/// <summary>
/// Xuất dữ liệu Word
/// </summary>
public interface IWordExporterProvider
{
    /// <summary>
    /// Xuất dữ liệu
    /// </summary>
    /// <param name="data">Dữ liệu xuất</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Stream> ExportAsync(object data, CancellationToken cancellationToken = default);
    /// <summary>
    /// Xuất dữ liệu
    /// </summary>
    /// <param name="template">Dữ liệu mẫu</param>
    /// <param name="data">Dữ liệu xuất</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Stream> ExportAsync(byte[] template, object data, CancellationToken cancellationToken = default);
}
