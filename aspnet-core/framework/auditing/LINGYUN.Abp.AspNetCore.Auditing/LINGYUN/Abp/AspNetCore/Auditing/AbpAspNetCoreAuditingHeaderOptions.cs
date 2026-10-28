using System.Collections.Generic;

namespace LINGYUN.Abp.AspNetCore.Auditing;
public class AbpAspNetCoreAuditingHeaderOptions
{
    /// <summary>
    /// Có ghi lại header của yêu cầu Http trong nhật ký kiểm toán hay không, mặc định: true
    /// </summary>
    public bool IsEnabled {  get; set; }
    /// <summary>
    /// Các header của yêu cầu Http cần ghi lại
    /// </summary>
    public IList<string> HttpHeaders { get; }
    public AbpAspNetCoreAuditingHeaderOptions()
    {
        IsEnabled = true;
        HttpHeaders = new List<string>();
    }
}
