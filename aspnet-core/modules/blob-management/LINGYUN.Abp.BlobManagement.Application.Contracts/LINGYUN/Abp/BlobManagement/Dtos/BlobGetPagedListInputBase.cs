using System;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.BlobManagement.Dtos;

public abstract class BlobGetPagedListInputBase : PagedAndSortedResultRequestDto
{
    /// <summary>
    /// BlobId cấp trên
    /// </summary>
    public Guid? ParentId { get; set; }
    /// <summary>
    /// Loại
    /// </summary>
    public BlobType? Type { get; set; }
    /// <summary>
    /// Loại nội dung
    /// </summary>
    public string? ContentType { get; set; }
}
