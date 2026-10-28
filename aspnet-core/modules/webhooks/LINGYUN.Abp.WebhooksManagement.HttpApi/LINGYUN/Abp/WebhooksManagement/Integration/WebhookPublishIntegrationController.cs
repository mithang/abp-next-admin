using Asp.Versioning;
using LINGYUN.Abp.WebhooksManagement.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Volo.Abp;

namespace LINGYUN.Abp.WebhooksManagement.Integration;

// SEC-26: [Authorize(Publish)] ở tầng controller (không chạm service) — service
// này còn được dùng in-process bởi ClientProxiesWebhookPublisher, đường đó
// không qua controller nên không bị ảnh hưởng; chỉ đường HTTP bị chặn. Dùng
// đúng permission Publish mà WebhookPublishAppService dùng (ghi chú trong
// WebhooksManagementPermissions: quyền này "nên cấp cho máy khách").
// Trước sửa, ẩn danh POST publish được webhook (đã xác minh live với tên
// webhook không tồn tại — không subscriber nào nhận dữ liệu giả).
[Authorize(WebhooksManagementPermissions.Publish)]
[Area(WebhooksManagementRemoteServiceConsts.ModuleName)]
[ControllerName("WebhookPublishIntegration")]
[RemoteService(Name = WebhooksManagementRemoteServiceConsts.RemoteServiceName)]
[Route($"integration-api/{WebhooksManagementRemoteServiceConsts.ModuleName}/webhooks/publish")]
public class WebhookPublishIntegrationController : WebhooksManagementControllerBase, IWebhookPublishIntegrationService
{
    protected IWebhookPublishIntegrationService PublishAppService { get; }

    public WebhookPublishIntegrationController(IWebhookPublishIntegrationService publishAppService)
    {
        PublishAppService = publishAppService;
    }

    [HttpPost]
    public virtual Task PublishAsync(WebhookPublishInput input)
    {
        return PublishAppService.PublishAsync(input);
    }
}
