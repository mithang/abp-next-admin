using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Exporter;
/// <summary>
/// Nhà cung cấp nhập dữ liệu
/// </summary>
[Obsolete("This interface will be deprecated in future versions. Please use IExcelImporterProvider instead.")]
public interface IImporterProvider
{
    /// <summary>
    /// Nhập dữ liệu
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="stream"></param>
    /// <returns></returns>
    Task<IReadOnlyCollection<T>> ImportAsync<T>(Stream stream)
        where T : class, new();
}
