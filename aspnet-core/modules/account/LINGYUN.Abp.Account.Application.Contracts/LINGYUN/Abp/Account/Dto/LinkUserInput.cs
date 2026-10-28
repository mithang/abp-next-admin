using System.ComponentModel.DataAnnotations;

namespace LINGYUN.Abp.Account.Dto;
/// <summary>
/// Dto người dùng liên kết
/// </summary>
public class LinkUserInput : LinkUserBaseDto
{
    /// <summary>
    /// Token người dùng liên kết
    /// </summary>
    [Required]
    public string Token { get; set; } = default!;
}
