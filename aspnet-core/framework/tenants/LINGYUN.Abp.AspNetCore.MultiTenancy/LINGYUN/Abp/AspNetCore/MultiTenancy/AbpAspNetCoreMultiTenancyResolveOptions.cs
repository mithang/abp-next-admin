namespace LINGYUN.Abp.AspNetCore.MultiTenancy;

public class AbpAspNetCoreMultiTenancyResolveOptions
{
    /// <summary>
    /// Chỉ phân giải tenant trong tên miền, mặc định: true
    /// </summary>
    public bool OnlyResolveDomain {  get; set; }
    public AbpAspNetCoreMultiTenancyResolveOptions()
    {
        OnlyResolveDomain = true;
    }
}
