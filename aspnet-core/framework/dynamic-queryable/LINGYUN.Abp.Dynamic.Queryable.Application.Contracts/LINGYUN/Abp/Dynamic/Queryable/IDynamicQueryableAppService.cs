using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.Dynamic.Queryable;

public interface IDynamicQueryableAppService<TEntityDto>
{
    /// <summary>
    /// Lấy danh sách các trường khả dụng
    /// </summary>
    /// <returns></returns>
    Task<ListResultDto<DynamicParamterDto>> GetAvailableFieldsAsync();
    /// <summary>
    /// Truy vấn dữ liệu theo điều kiện động
    /// </summary>
    /// <param name="dynamicInput"></param>
    /// <returns></returns>
    Task<PagedResultDto<TEntityDto>> SearchAsync(GetListByDynamicQueryableInput dynamicInput);
}
