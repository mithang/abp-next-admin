using System;
using System.ComponentModel.DataAnnotations;

namespace LINGYUN.Abp.BlobManagement.Dtos;

public class BlobFolderCreateDto : BlobFolderCreateBaseDto
{
    /// <summary>
    /// Id container
    /// </summary>
    [Required]
    public Guid ContainerId { get; set; }
}
