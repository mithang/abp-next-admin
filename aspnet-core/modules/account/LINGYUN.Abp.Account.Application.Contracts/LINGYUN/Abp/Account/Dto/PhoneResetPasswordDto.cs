using System.ComponentModel.DataAnnotations;
using Volo.Abp.Auditing;
using Volo.Abp.Identity;
using Volo.Abp.Validation;

namespace LINGYUN.Abp.Account;

public class PhoneResetPasswordDto
{
    [Required]
    [Phone]
    [DynamicStringLength(typeof(IdentityUserConsts), nameof(IdentityUserConsts.MaxPhoneNumberLength))]
    // Nếu thuộc tính Dto và nội dung bản địa hoá không nhất quán, cần chỉ định tên bản địa hoá như sau
    // [Display(Name = "DisplayName:RequiredPhoneNumber")] //trong file bản địa hoá JSON phải có cùng định dạng: DisplayName:RequiredPhoneNumber
    //[DisplayName("DisplayName:RequiredPhoneNumber")] //Cả hai cách đều được
    // Nếu thuộc tính Dto nhất quán với nội dung bản địa hoá, không cần chỉ định tên hiển thị, nhưng file bản địa hoá phải có văn bản định dạng tương ứng: DisplayName:PhoneNumber
    public string PhoneNumber { get; set; } = default!;

    [Required]
    [DynamicStringLength(typeof(IdentityUserConsts), nameof(IdentityUserConsts.MaxPasswordLength))]
    [DataType(DataType.Password)]
    [DisableAuditing]
    public string NewPassword { get; set; } = default!;

    [Required]
    [StringLength(6)]
    [DisableAuditing]
    [Display(Name = "DisplayName:SmsVerifyCode")]
    public string Code { get; set; } = default!;
}
