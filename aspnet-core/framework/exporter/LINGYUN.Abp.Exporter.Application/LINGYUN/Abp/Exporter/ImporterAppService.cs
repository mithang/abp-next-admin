using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.Exporter;

public abstract class ImporterAppService<TEntity, TEntityImportDto> : ApplicationService, IImporterAppService<TEntityImportDto>
    where TEntityImportDto : class, new()
{
    private readonly IExcelImporterProvider _importerProvider;
    protected ImporterAppService(IExcelImporterProvider importerProvider)
    {
        _importerProvider = importerProvider;
    }

    public async virtual Task ImportAsync(TEntityImportDto input)
    {
        var stream = await GetImportStream(input);
        var entitieDtoList = await _importerProvider.ImportAsync<TEntityImportDto>(stream);

        var entities = MapDtoToEntities([.. entitieDtoList]);

        await SaveManyEntities(entities);
    }
    /// <summary>
    /// Phương thức triển khai dùng để trích xuất luồng tệp từ dữ liệu nhập vào
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    protected abstract Task<Stream> GetImportStream(TEntityImportDto input);
    /// <summary>
    /// Phương thức triển khai dùng để lưu danh sách thực thể vào cơ sở lưu trữ bền vững
    /// </summary>
    /// <param name="entities"></param>
    /// <returns></returns>
    protected abstract Task SaveManyEntities(ICollection<TEntity> entities);
    /// <summary>
    /// Phương thức triển khai dùng để ánh xạ đối tượng truyền dữ liệu thực thể
    /// </summary>
    /// <param name="entitieDtoList"></param>
    /// <returns></returns>
    protected virtual List<TEntity> MapDtoToEntities(List<TEntityImportDto> entitieDtoList)
    {
        return ObjectMapper.Map<List<TEntityImportDto>, List<TEntity>>(entitieDtoList);
    }
}
