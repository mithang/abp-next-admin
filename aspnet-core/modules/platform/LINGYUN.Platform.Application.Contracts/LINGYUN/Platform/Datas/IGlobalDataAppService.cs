using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Platform.Datas;
/// <summary>
/// Giao diện dịch vụ ứng dụng từ điển dữ liệu dùng chung
/// </summary>
public interface IGlobalDataAppService : IApplicationService
{
    /// <summary>
    /// Lấy từ điển dữ liệu
    /// </summary>
    /// <param name="name">Tên</param>
    /// <returns></returns>
    Task<DataDto> GetByNameAsync(string name);
    /// <summary>
    /// Lấy từ điển dữ liệu
    /// </summary>
    /// <param name="id">Id</param>
    /// <returns></returns>
    Task<DataDto> GetAsync(Guid id);
    /// <summary>
    /// Lấy tất cả từ điển dữ liệu
    /// </summary>
    /// <returns></returns>
    Task<ListResultDto<DataDto>> GetAllAsync();
}
