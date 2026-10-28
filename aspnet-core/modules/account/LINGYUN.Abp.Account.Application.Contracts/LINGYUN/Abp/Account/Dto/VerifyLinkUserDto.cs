using System;

namespace LINGYUN.Abp.Account.Dto;

public class VerifyLinkUserDto
{
    /// <summary>
    /// Id người dùng liên kết
    /// </summary>
    public Guid? LinkUserId { get; set; }
    /// <summary>
    /// Tên người dùng liên kết
    /// </summary>
    public string? LinkUserName { get; set; }
    /// <summary>
    /// Id tenant liên kết
    /// </summary>
    public Guid? LinkTenantId { get; set; }
    /// <summary>
    /// Tên tenant liên kết
    /// </summary>
    public string? LinkTenantName { get; set; }
    /// <summary>
    /// Đã liên kết hay chưa
    /// </summary>
    public bool IsLinked { get; set; }
}
