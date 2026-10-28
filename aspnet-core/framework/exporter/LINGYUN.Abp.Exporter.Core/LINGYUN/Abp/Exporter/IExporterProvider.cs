using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Exporter;
/// <summary>
/// Nhà cung cấp xuất dữ liệu
/// </summary>
[Obsolete("This interface will be deprecated in future versions. Please use IExcelExporterProvider instead.")]
public interface IExporterProvider
{
    /// <summary>
    /// Xuất dữ liệu
    /// </summary>
    /// <param name="data">Dữ liệu xuất</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Stream> ExportAsync<T>(ICollection<T> data, CancellationToken cancellationToken = default)
        where T : class, new();
}
