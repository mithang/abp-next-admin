namespace LINGYUN.Abp.AspNetCore.Session;

public class AbpAspNetCoreSessionOptions
{
    /// <summary>
    /// Có phân tích thông tin địa lý IP hay không
    /// </summary>
    public bool IsParseIpLocation { get; set; }

    public AbpAspNetCoreSessionOptions()
    {
        IsParseIpLocation = false;
    }
}
