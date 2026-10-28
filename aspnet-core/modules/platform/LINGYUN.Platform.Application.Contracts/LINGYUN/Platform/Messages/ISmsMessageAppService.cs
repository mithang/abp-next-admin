using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Platform.Messages;
public interface ISmsMessageAppService : IApplicationService
{
    /// <summary>
    /// Lấy thông báo SMS
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<SmsMessageDto> GetAsync(Guid id);
    /// <summary>
    /// Xoá thông báo SMS
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteAsync(Guid id);
    /// <summary>
    /// Gửi lại thông báo SMS
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task SendAsync(Guid id);
    /// <summary>
    /// Lấy danh sách thông báo SMS
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<SmsMessageDto>> GetListAsync(SmsMessageGetListInput input);
}
