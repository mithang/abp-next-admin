using System.ComponentModel.DataAnnotations;
using Volo.Abp.Validation;

namespace LINGYUN.Abp.TaskManagement;

public class BackgroundJobActionCreateDto : BackgroundJobActionCreateOrUpdateDto
{
    /// <summary>
    /// Tên
    /// </summary>
    [Required]
    [DynamicStringLength(typeof(BackgroundJobActionConsts), nameof(BackgroundJobActionConsts.MaxNameLength))]
    public string Name { get; set; } = default!;
}
