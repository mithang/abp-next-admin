using Asp.Versioning;
using LINGYUN.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;

namespace LINGYUN.Platform.Messages.Integration;

// SEC-25: [Authorize(SendMessage)] ở tầng controller (không chạm service) —
// service này còn được dùng in-process bởi PlatformSmsSender (ISmsSender của
// app), đường đó không qua controller nên không bị ảnh hưởng; chỉ đường HTTP
// bị chặn. Dùng đúng permission SendMessage mà SmsMessageAppService dùng cho
// thao tác gửi (tránh lạm dụng gửi SMS tốn phí bởi tài khoản thường).
// Trước sửa, ẩn danh POST tạo được bản ghi SMS chờ gửi (đã xác minh live).
[Authorize(PlatformPermissions.SmsMessage.SendMessage)]
[Area(PlatformRemoteServiceConsts.ModuleName)]
[ControllerName("SmsMessageIntegration")]
[RemoteService(Name = PlatformRemoteServiceConsts.RemoteServiceName)]
[Route($"integration-api/{PlatformRemoteServiceConsts.ModuleName}/messages/sms")]
public class SmsMessageIntegrationController : AbpControllerBase, ISmsMessageIntegrationService
{
    private readonly ISmsMessageIntegrationService _service;
    public SmsMessageIntegrationController(ISmsMessageIntegrationService service)
    {
        _service = service;
    }

    [HttpPost]
    public virtual Task<SmsMessageDto> CreateAsync(SmsMessageCreateDto input)
    {
        return _service.CreateAsync(input);
    }
}
