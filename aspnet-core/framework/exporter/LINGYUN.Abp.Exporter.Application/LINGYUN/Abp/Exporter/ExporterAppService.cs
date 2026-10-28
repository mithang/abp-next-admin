using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Content;

namespace LINGYUN.Abp.Exporter;

public abstract class ExporterAppService<TEntity, TEntityExportDto, TEntityListGetInput> : ApplicationService, IExporterAppService<TEntityExportDto, TEntityListGetInput>
    where TEntityExportDto : class, new()
{
    private readonly IExcelExporterProvider _exporterProvider;

    protected ExporterAppService(IExcelExporterProvider exporterProvider)
    {
        _exporterProvider = exporterProvider;
    }

    public async virtual Task<IRemoteStreamContent> ExportAsync(TEntityListGetInput input)
    {
        var fileName = GetExportFileName(input);

        var entities = await GetListAsync(input);
        var entitieDtoList = MapEntitiesToDto(entities);

        var stream = await _exporterProvider.ExportAsync(entitieDtoList);

        return new RemoteStreamContent(stream, fileName);
    }
    /// <summary>
    /// Phương thức triển khai dùng để trả về tên tệp xuất
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    protected abstract string GetExportFileName(TEntityListGetInput input);
    /// <summary>
    /// Phương thức triển khai dùng để truy vấn danh sách thực thể cần xuất
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    protected abstract Task<List<TEntity>> GetListAsync(TEntityListGetInput input);
    /// <summary>
    /// Phương thức triển khai dùng để ánh xạ đối tượng truyền dữ liệu thực thể
    /// </summary>
    /// <param name="entities"></param>
    /// <returns></returns>
    protected virtual List<TEntityExportDto> MapEntitiesToDto(List<TEntity> entities)
    {
        return ObjectMapper.Map<List<TEntity>, List<TEntityExportDto>>(entities);
    }
}
