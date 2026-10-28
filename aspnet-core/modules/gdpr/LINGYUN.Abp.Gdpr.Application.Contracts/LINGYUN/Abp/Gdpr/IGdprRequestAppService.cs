using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Content;

namespace LINGYUN.Abp.Gdpr;

public interface IGdprRequestAppService : IApplicationService
{
    /// <summary>
    /// Lấy chi tiết yêu cầu dữ liệu cá nhân
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<GdprRequestDto> GetAsync(Guid id);
    /// <summary>
    /// Lấy danh sách yêu cầu dữ liệu cá nhân
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<GdprRequestDto>> GetListAsync(GdprRequestGetListInput input);
    /// <summary>
    /// Tải xuống dữ liệu người dùng đã thu thập
    /// </summary>
    /// <param name="requestId"></param>
    /// <returns></returns>
    Task<IRemoteStreamContent> DownloadPersonalDataAsync(Guid requestId);
    /// <summary>
    /// Xóa yêu cầu dữ liệu cá nhân
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteAsync(Guid id);
    /// <summary>
    /// Chuẩn bị dữ liệu người dùng
    /// </summary>
    /// <returns></returns>
    Task PreparePersonalDataAsync();
    /// <summary>
    /// Xóa dữ liệu người dùng
    /// </summary>
    /// <returns></returns>
    Task DeletePersonalDataAsync();
    /// <summary>
    /// Xóa tài khoản người dùng
    /// </summary>
    /// <returns></returns>
    Task DeletePersonalAccountAsync();
}
