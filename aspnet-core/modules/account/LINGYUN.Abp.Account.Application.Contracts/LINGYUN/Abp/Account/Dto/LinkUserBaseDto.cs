using System;

namespace LINGYUN.Abp.Account.Dto;

public abstract class LinkUserBaseDto
{
    /// <summary>
    /// Id người dùng liên kết
    /// </summary>
    public Guid UserId { get; set; }
    /// <summary>
    /// Id tenant liên kết
    /// </summary>
    public Guid? TenantId { get; set; }
}
