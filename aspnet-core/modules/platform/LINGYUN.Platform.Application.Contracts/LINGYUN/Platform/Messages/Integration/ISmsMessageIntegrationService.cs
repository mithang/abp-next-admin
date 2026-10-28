using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;

namespace LINGYUN.Platform.Messages.Integration;

[IntegrationService]
public interface ISmsMessageIntegrationService : IApplicationService
{
    /// <summary>
    /// Tạo tin nhắn SMS
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<SmsMessageDto> CreateAsync(SmsMessageCreateDto input);
}
