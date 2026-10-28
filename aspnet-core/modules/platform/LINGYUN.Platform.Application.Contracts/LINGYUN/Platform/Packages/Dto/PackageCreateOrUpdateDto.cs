using System.ComponentModel.DataAnnotations;
using Volo.Abp.Validation;

namespace LINGYUN.Platform.Packages;

public abstract class PackageCreateOrUpdateDto
{
    /// <summary>
    /// Ghi chú phiên bản
    /// </summary>
    [Required]
    [DynamicMaxLength(typeof(PackageConsts), nameof(PackageConsts.MaxNoteLength))]
    public string Note { get; set; } = default!;
    /// <summary>
    /// Mô tả
    /// </summary>
    [DynamicMaxLength(typeof(PackageConsts), nameof(PackageConsts.MaxDescriptionLength))] 
    public string? Description { get; set; }
    /// <summary>
    /// Cập nhật bắt buộc
    /// </summary>
    public bool ForceUpdate { get; set; }

    [DynamicMaxLength(typeof(PackageConsts), nameof(PackageConsts.MaxAuthorsLength))]
    public string? Authors { get; set; }

    public PackageLevel Level { get; set; }
}
