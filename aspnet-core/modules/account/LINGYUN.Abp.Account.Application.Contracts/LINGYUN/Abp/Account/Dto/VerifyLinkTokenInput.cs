using System.ComponentModel.DataAnnotations;

namespace LINGYUN.Abp.Account.Dto;
/// <summary>
/// Dto xác minh Token người dùng liên kết
/// </summary>
public class VerifyLinkTokenInput : LinkUserBaseDto
{
    /// <summary>
    /// Token người dùng liên kết
    /// </summary>
    [Required]
    public string Token { get; set; } = default!;
}
