using LINGYUN.Abp.BlobManagement.Dtos;
using LINGYUN.Abp.BlobManagement.Integration.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Content;

namespace LINGYUN.Abp.BlobManagement.Integration;

[Controller]
[Area(BlobManagementRemoteServiceConsts.ModuleName)]
[RemoteService(Name = BlobManagementRemoteServiceConsts.RemoteServiceName)]
[Route($"integration-api/{BlobManagementRemoteServiceConsts.ModuleName}/blobs")]
// SEC-23 (security iter 10): this integration API was anonymously reachable —
// anon callers could upload, download and delete blobs by container/blob name
// (verified live on the temp container, probe blob created then deleted).
// Controller-level [Authorize] closes anonymous HTTP access only: the service
// itself is also used in-process by BlobManagementBlobProvider, and that path
// does not go through this controller, so it is unaffected. Legitimate
// inter-service HTTP callers must now present a token (user or service
// identity); anonymous third-party upload, if any exists, needs a service
// account instead of anonymous access.
[Authorize]
public class BlobIntegrationController : AbpControllerBase, IBlobIntegrationService
{
    private readonly IBlobIntegrationService _service;

    public BlobIntegrationController(IBlobIntegrationService service)
    {
        _service = service;
    }

    [HttpPost]
    public virtual Task<BlobDto> CreateAsync([FromForm] BlobFileCreateIntegrationDto input)
    {
        return _service.CreateAsync(input);
    }

    [HttpDelete]
    public virtual Task DeleteAsync(BlobFileGetByNameIntegrationDto input)
    {
        return _service.DeleteAsync(input);
    }

    [HttpGet("exists")]
    public virtual Task<bool> ExistsAsync(BlobFileGetByNameIntegrationDto input)
    {
        return _service.ExistsAsync(input);
    }

    [HttpGet("download")]
    public virtual Task<IRemoteStreamContent> DownloadAsync(BlobFileGetByNameIntegrationDto input)
    {
        return _service.DownloadAsync(input);
    }
}
