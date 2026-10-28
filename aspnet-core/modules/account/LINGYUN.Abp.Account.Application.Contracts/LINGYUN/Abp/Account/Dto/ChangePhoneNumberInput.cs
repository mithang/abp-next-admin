using System.ComponentModel.DataAnnotations;
using Volo.Abp.Auditing;
using Volo.Abp.Identity;
using Volo.Abp.Validation;

namespace LINGYUN.Abp.Account;

public class ChangePhoneNumberInput
{
    /// <summary>
    /// Số điện thoại mới
    /// </summary>
    [Required]
    [Phone]
    [DynamicStringLength(typeof(IdentityUserConsts), nameof(IdentityUserConsts.MaxPhoneNumberLength))]
    [Display(Name = "PhoneNumber")]
    public string NewPhoneNumber { get; set; } = default!;
    /// <summary>
    /// Mã xác minh bảo mật
    /// </summary>
    [Required]
    [DisableAuditing]
    [StringLength(6, MinimumLength = 6)]
    [Display(Name = "SmsVerifyCode")]
    public string Code { get; set; } = default!;
}
