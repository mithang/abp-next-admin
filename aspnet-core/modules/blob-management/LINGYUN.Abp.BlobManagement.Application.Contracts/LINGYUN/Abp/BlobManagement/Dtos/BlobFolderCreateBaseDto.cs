using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Validation;

namespace LINGYUN.Abp.BlobManagement.Dtos;

public abstract class BlobFolderCreateBaseDto
{
    /// <summary>
    /// Tên
    /// </summary>
    [Required]
    [DynamicStringLength(typeof(BlobConsts), nameof(BlobConsts.MaxNameLength))]
    public string Name { get; set; } = default!;
    /// <summary>
    /// BlobId thư mục cha
    /// </summary>
    public Guid? ParentId { get; set; }
}
