using System;
using Volo.Abp.Validation;

namespace LINGYUN.Platform.Portal;

public abstract class EnterpriseCreateOrUpdateDto 
{
    /// <summary>
    /// Tenant liên kết
    /// </summary>
    public Guid? TenantId { get; set; }
    /// <summary>
    /// Tên tiếng Anh
    /// </summary>
    [DynamicStringLength(typeof(EnterpriseConsts), nameof(EnterpriseConsts.MaxEnglishNameLength))]
    public string? EnglishName { get; set; }
    /// <summary>
    /// Logo
    /// </summary>
    [DynamicStringLength(typeof(EnterpriseConsts), nameof(EnterpriseConsts.MaxLogoLength))]
    public string? Logo { get; set; }
    /// <summary>
    /// Địa chỉ
    /// </summary>
    [DynamicStringLength(typeof(EnterpriseConsts), nameof(EnterpriseConsts.MaxAddressLength))]
    public string? Address { get; set; }
    /// <summary>
    /// Người đại diện pháp luật
    /// </summary>
    [DynamicStringLength(typeof(EnterpriseConsts), nameof(EnterpriseConsts.MaxLegalManLength))]
    public string? LegalMan { get; set; }
    /// <summary>
    /// Mã số đăng ký thuế
    /// </summary>
    [DynamicStringLength(typeof(EnterpriseConsts), nameof(EnterpriseConsts.MaxTaxCodeLength))]
    public string? TaxCode { get; set; }
    /// <summary>
    /// Mã tổ chức
    /// </summary>
    [DynamicStringLength(typeof(EnterpriseConsts), nameof(EnterpriseConsts.MaxOrganizationCodeLength))]
    public string? OrganizationCode { get; set; }
    /// <summary>
    /// Mã đăng ký
    /// </summary>
    [DynamicStringLength(typeof(EnterpriseConsts), nameof(EnterpriseConsts.MaxRegistrationCodeLength))]
    public string? RegistrationCode { get; set; }
    /// <summary>
    /// Ngày đăng ký
    /// </summary>
    public DateTime? RegistrationDate { get; set; }
    /// <summary>
    /// Ngày hết hạn
    /// </summary>
    public DateTime? ExpirationDate { get; set; }
}
