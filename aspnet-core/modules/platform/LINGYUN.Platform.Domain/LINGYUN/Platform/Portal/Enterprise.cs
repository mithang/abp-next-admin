using System;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities.Auditing;

namespace LINGYUN.Platform.Portal;
/// <summary>
/// Thông tin doanh nghiệp
/// </summary>
public class Enterprise : FullAuditedAggregateRoot<Guid>
{
    /// <summary>
    /// Tenant liên kết
    /// </summary>
    public virtual Guid? TenantId { get; protected set; }
    /// <summary>
    /// Tên
    /// </summary>
    public virtual string Name { get; protected set; } = default!;
    /// <summary>
    /// Tên tiếng Anh
    /// </summary>
    public virtual string? EnglishName { get; set; }
    /// <summary>
    /// Logo
    /// </summary>
    public virtual string? Logo { get; set; }
    /// <summary>
    /// Địa chỉ
    /// </summary>
    public virtual string? Address { get; set; }
    /// <summary>
    /// Người đại diện pháp luật
    /// </summary>
    public virtual string? LegalMan { get; set; }
    /// <summary>
    /// Mã số thuế
    /// </summary>
    public virtual string? TaxCode { get; set; }
    /// <summary>
    /// Mã tổ chức
    /// </summary>
    public virtual string? OrganizationCode { get; protected set; }
    /// <summary>
    /// Mã đăng ký
    /// </summary>
    public virtual string? RegistrationCode { get; protected set; }
    /// <summary>
    /// Ngày đăng ký
    /// </summary>
    public virtual DateTime? RegistrationDate { get; protected set; }
    /// <summary>
    /// Ngày hết hạn
    /// </summary>
    public virtual DateTime? ExpirationDate { get; protected set; }
    protected Enterprise() 
    {
        ExtraProperties = new ExtraPropertyDictionary();
        this.SetDefaultsForExtraProperties();
    }

    public Enterprise(
        Guid id,
        string name,
        string? address = null, 
        string? taxCode = null, 
        string? organizationCode = null, 
        string? registrationCode = null, 
        DateTime? registrationDate = null, 
        DateTime? expirationDate = null,
        Guid? tenantId = null)
        : base(id)
    {
        Address = Check.Length(address, nameof(address), EnterpriseConsts.MaxAddressLength);
        TaxCode = Check.Length(taxCode, nameof(taxCode), EnterpriseConsts.MaxTaxCodeLength);
        TenantId = tenantId;

        SetName(name);
        SetOrganization(organizationCode);
        SetRegistration(registrationCode, registrationDate, expirationDate);

        ExtraProperties = new ExtraPropertyDictionary();
        this.SetDefaultsForExtraProperties(); 
    }

    public void SetTenantId(Guid? tenantId = null)
    {
        TenantId = tenantId;
    }

    public void SetName(string name, string? englishName = null)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), EnterpriseConsts.MaxNameLength);
        EnglishName = Check.Length(englishName, nameof(englishName), EnterpriseConsts.MaxEnglishNameLength);
    }

    public void SetOrganization(string? organizationCode)
    {
        OrganizationCode = Check.Length(organizationCode, nameof(organizationCode), EnterpriseConsts.MaxOrganizationCodeLength);
    }

    public void SetRegistration(
        string? registrationCode,
        DateTime? registrationDate = null,
        DateTime? expirationDate = null)
    {
        RegistrationCode = Check.Length(registrationCode, nameof(registrationCode), EnterpriseConsts.MaxRegistrationCodeLength);
        RegistrationDate = registrationDate;
        ExpirationDate = expirationDate;
    }
}
