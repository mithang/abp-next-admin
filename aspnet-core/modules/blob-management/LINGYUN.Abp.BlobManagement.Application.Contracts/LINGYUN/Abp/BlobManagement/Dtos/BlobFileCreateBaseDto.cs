using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Auditing;
using Volo.Abp.Content;
using Volo.Abp.Validation;

namespace LINGYUN.Abp.BlobManagement.Dtos;

public abstract class BlobFileCreateBaseDto
{
    /// <summary>
    /// Dùng để phía máy chủ xác thực file tải lên
    /// </summary>
    public string? CompareMd5 { get; set; }
    /// <summary>
    /// Tên
    /// </summary>
    [Required]
    [DynamicStringLength(typeof(BlobConsts), nameof(BlobConsts.MaxNameLength))]
    public string Name { get; set; } = default!;
    /// <summary>
    /// BlobId sở hữu
    /// </summary>
    public Guid? ParentId { get; set; }
    /// <summary>
    /// Nội dung file
    /// </summary>
    [DisableAuditing]
    [DisableValidation]
    public IRemoteStreamContent File { get; set; } = default!;
}
