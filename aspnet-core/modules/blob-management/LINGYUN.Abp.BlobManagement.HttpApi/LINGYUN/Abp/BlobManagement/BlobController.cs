using LINGYUN.Abp.BlobManagement.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Content;

namespace LINGYUN.Abp.BlobManagement;

[Controller]
[Area(BlobManagementRemoteServiceConsts.ModuleName)]
[RemoteService(Name = BlobManagementRemoteServiceConsts.RemoteServiceName)]
[Route($"api/{BlobManagementRemoteServiceConsts.ModuleName}/blobs")]
public class BlobController : BlobControllerBase, IBlobAppService
{

    private readonly IBlobAppService _service;

    public BlobController(IBlobAppService service)
    {
        _service = service;
    }

    // SEC-10 (vòng 12): đã gỡ [IgnoreAntiforgeryToken] vì attribute này vốn không có tác
    // dụng — các API controller không validate antiforgery token (đã chứng minh: endpoint
    // tạo folder vốn không có Ignore vẫn nhận cookie upload không token, và sau khi gỡ
    // thì cookie upload vẫn thành công). Việc gỡ chỉ dọn thuộc tính gây hiểu lầm, KHÔNG
    // tạo thêm lớp bảo vệ. Chống CSRF cho session cookie hiện dựa vào SameSite=Lax của
    // cookie .AspNetCore.Identity.Application (đã kiểm chứng thuộc tính cookie); hardening
    // triệt để (chỉ nhận bearer cho /api) là việc app-wide, xem báo cáo security-iter-0012.
    [HttpPost("file")]
    public virtual Task<BlobDto> CreateFileAsync([FromForm] BlobFileCreateDto input)
    {
        input.CompareMd5 ??= GetCompareMd5InHeader();
        return _service.CreateFileAsync(input);
    }

    // SEC-10: như CreateFileAsync — gỡ [IgnoreAntiforgeryToken] (vốn không có tác dụng).
    [HttpPost("file/chunk")]
    public virtual Task CreateChunkFileAsync([FromForm] BlobFileChunkCreateDto input)
    {
        input.CompareMd5 ??= GetCompareMd5InHeader();
        return _service.CreateChunkFileAsync(input);
    }

    [HttpPost("folder")]
    public virtual Task<BlobDto> CreateFolderAsync(BlobFolderCreateDto input)
    {
        return _service.CreateFolderAsync(input);
    }

    [HttpDelete("{id}")]
    public virtual Task DeleteAsync(Guid id)
    {
        return _service.DeleteAsync(id);
    }

    [HttpGet("download/{key}")]
    public virtual Task<IRemoteStreamContent> DownloadAsync(BlobDownloadByIdInput input)
    {
        return _service.DownloadAsync(input);
    }

    [HttpGet("preview/{key}")]
    public async virtual Task<IRemoteStreamContent> PreviewAsync(BlobDownloadByIdInput input)
    {
        var content = await _service.PreviewAsync(input);

        if (!content.FileName.IsNullOrWhiteSpace())
        {
            var contentDisposition = new ContentDispositionHeaderValue("inline");
            contentDisposition.SetHttpFileName(content.FileName);
            HttpContext.Response.Headers[HeaderNames.ContentDisposition] = contentDisposition.ToString();
        }

        return content;
    }

    [HttpGet("download/by-name/{name}")]
    [HttpGet("download/by-name/t/{tenantId}/{name}")]
    public virtual Task<IRemoteStreamContent> DownloadByNameAsync(BlobDownloadByNameInput input)
    {
        return _service.DownloadByNameAsync(input);
    }

    [HttpGet("{id}")]
    public virtual Task<BlobDto> GetAsync(Guid id)
    {
        return _service.GetAsync(id);
    }

    [HttpGet]
    public virtual Task<PagedResultDto<BlobDto>> GetListAsync(BlobGetPagedListInput input)
    {
        return _service.GetListAsync(input);
    }

    [HttpGet("generate/download-url/{id}")]
    public virtual Task<string> GenerateDownloadUrlAsync(Guid id)
    {
        return _service.GenerateDownloadUrlAsync(id);
    }

    [HttpGet("generate/preview-url/{id}")]
    public virtual Task<string> GeneratePreviewUrlAsync(Guid id)
    {
        return _service.GeneratePreviewUrlAsync(id);
    }
}
