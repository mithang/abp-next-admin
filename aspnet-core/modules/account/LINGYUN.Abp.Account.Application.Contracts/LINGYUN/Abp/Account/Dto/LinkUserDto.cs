using System;

namespace LINGYUN.Abp.Account.Dto;
/// <summary>
/// Dto người dùng liên kết
/// </summary>
public class LinkUserDto
{
    /// <summary>
    /// Id người dùng liên kết
    /// </summary>
    public Guid LinkUserId { get; set; }
    /// <summary>
    /// Tên người dùng liên kết
    /// </summary>
    public string LinkUserName { get; set; } = default!;
    /// <summary>
    /// Id tenant liên kết
    /// </summary>
    public Guid? LinkTenantId { get; set; }
    /// <summary>
    /// Tên tenant liên kết
    /// </summary>
    public string? LinkTenantName { get; set; }
    /// <summary>
    /// Liên kết trực tiếp
    /// </summary>
    public bool DirectlyLinked { get; set; }
}
