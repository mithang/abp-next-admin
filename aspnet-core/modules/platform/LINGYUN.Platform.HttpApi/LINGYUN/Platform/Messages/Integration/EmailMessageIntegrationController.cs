using Asp.Versioning;
using LINGYUN.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;

namespace LINGYUN.Platform.Messages.Integration;

// SEC-24: [Authorize(SendMessage)] ở tầng controller (không chạm service) —
// service này còn được dùng in-process bởi PlatformEmailSender (IEmailSender
// của app), đường đó không qua controller nên không bị ảnh hưởng; chỉ đường
// HTTP bị chặn. Dùng đúng permission SendMessage mà EmailMessageAppService
// dùng cho thao tác gửi, thay vì [Authorize] trần (người dùng thường đã đăng
// nhập nhưng không có quyền gửi vẫn phải bị chặn — tránh lạm dụng gửi mail).
// Trước sửa, ẩn danh POST tạo được bản ghi email chờ gửi (đã xác minh live).
[Authorize(PlatformPermissions.EmailMessage.SendMessage)]
[Area(PlatformRemoteServiceConsts.ModuleName)]
[ControllerName("EmailMessageIntegration")]
[RemoteService(Name = PlatformRemoteServiceConsts.RemoteServiceName)]
[Route($"integration-api/{PlatformRemoteServiceConsts.ModuleName}/messages/email")]
public class EmailMessageIntegrationController : AbpControllerBase, IEmailMessageIntegrationService
{
    private readonly IEmailMessageIntegrationService _service;
    public EmailMessageIntegrationController(IEmailMessageIntegrationService service)
    {
        _service = service;
    }


    [HttpPost]
    public virtual Task<EmailMessageDto> CreateAsync([FromForm] EmailMessageCreateDto input)
    {
        return _service.CreateAsync(input);
    }
}
