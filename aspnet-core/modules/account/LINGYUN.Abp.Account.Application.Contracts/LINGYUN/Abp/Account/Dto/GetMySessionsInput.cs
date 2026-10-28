using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.Identity;
public class GetMySessionsInput : PagedAndSortedResultRequestDto
{
    /// <summary>
    /// Thiết bị
    /// </summary>
    public string? Device { get; set; }
    /// <summary>
    /// Id máy khách
    /// </summary>
    public string? ClientId { get; set; }
}
