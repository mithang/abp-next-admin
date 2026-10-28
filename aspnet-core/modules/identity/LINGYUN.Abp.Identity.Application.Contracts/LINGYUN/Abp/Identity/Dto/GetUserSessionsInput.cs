using System;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.Identity;
public class GetUserSessionsInput : PagedAndSortedResultRequestDto
{
    /// <summary>
    /// id người dùng
    /// </summary>
    public Guid? UserId { get; set; }
    /// <summary>
    /// Thiết bị
    /// </summary>
    public string? Device { get; set; }
    /// <summary>
    /// id máy khách
    /// </summary>
    public string? ClientId { get; set; }
}
