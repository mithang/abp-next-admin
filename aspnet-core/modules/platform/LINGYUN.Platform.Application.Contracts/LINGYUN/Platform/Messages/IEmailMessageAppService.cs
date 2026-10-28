using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Platform.Messages;
public interface IEmailMessageAppService : IApplicationService
{
    /// <summary>
    /// Lấy thông báo email
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<EmailMessageDto> GetAsync(Guid id);
    /// <summary>
    /// Xoá thông báo email
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteAsync(Guid id);
    /// <summary>
    /// Gửi thông báo email
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task SendAsync(Guid id);
    /// <summary>
    /// Lấy danh sách thông báo email
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<EmailMessageDto>> GetListAsync(EmailMessageGetListInput input);
}
