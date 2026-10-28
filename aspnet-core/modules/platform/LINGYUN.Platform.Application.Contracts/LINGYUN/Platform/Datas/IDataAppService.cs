using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Platform.Datas;
/// <summary>
/// Interface dịch vụ ứng dụng từ điển dữ liệu
/// </summary>
public interface IDataAppService : 
    ICrudAppService<
        DataDto,
        Guid,
        GetDataListInput,
        DataCreateDto,
        DataUpdateDto>
{
    /// <summary>
    /// Lấy từ điển dữ liệu
    /// </summary>
    /// <param name="name">Tên</param>
    /// <returns></returns>
    Task<DataDto> GetAsync(string name);
    /// <summary>
    /// Lấy tất cả từ điển dữ liệu
    /// </summary>
    /// <returns></returns>
    Task<ListResultDto<DataDto>> GetAllAsync();
    /// <summary>
    /// Xóa từ điển dữ liệu
    /// </summary>
    /// <param name="id">Id từ điển</param>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<DataDto> MoveAsync(Guid id, DataMoveDto input);
    /// <summary>
    /// Thêm mới mục từ điển dữ liệu
    /// </summary>
    /// <param name="id">Id từ điển</param>
    /// <param name="input"></param>
    /// <returns></returns>
    Task CreateItemAsync(Guid id, DataItemCreateDto input);
    /// <summary>
    /// Cập nhật mục từ điển dữ liệu
    /// </summary>
    /// <param name="id">Id từ điển</param>
    /// <param name="name">Tên mục</param>
    /// <param name="input"></param>
    /// <returns></returns>
    Task UpdateItemAsync(Guid id, string name, DataItemUpdateDto input);
    /// <summary>
    /// Xóa mục từ điển dữ liệu
    /// </summary>
    /// <param name="id">Id từ điển</param>
    /// <param name="name">Tên mục</param>
    /// <returns></returns>
    Task DeleteItemAsync(Guid id, string name);
}
