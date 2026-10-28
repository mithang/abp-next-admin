using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.MultiTenancy;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Text.Formatting;

namespace LINGYUN.Abp.AspNetCore.MultiTenancy;

public class OnlyDomainTenantResolveContributor : HttpTenantResolveContributorBase
{
    public const string ContributorName = "Domain";

    public override string Name => ContributorName;

    private static readonly string[] ProtocolPrefixes = { "http://", "https://" };

    private readonly string _domainFormat;

    public OnlyDomainTenantResolveContributor(string domainFormat)
    {
        _domainFormat = domainFormat.RemovePreFix(ProtocolPrefixes);
    }

    protected override Task<string?> GetTenantIdOrNameFromHttpContextOrNullAsync(ITenantResolveContext context, HttpContext httpContext)
    {
        if (!httpContext.Request.Host.HasValue)
        {
            return Task.FromResult<string?>(null);
        }

        var options = httpContext.RequestServices.GetRequiredService<IOptions<AbpAspNetCoreMultiTenancyResolveOptions>>();
        if (options.Value.OnlyResolveDomain)
        {
            // Chỉ phân giải tên miền, nếu yêu cầu là địa chỉ IP thì không dùng contributor phân giải này
            if (IPAddress.TryParse(httpContext.Request.Host.Host, out var _))
            {
                return Task.FromResult<string?>(null);
            }
        }

        var hostName = httpContext.Request.Host.Value.RemovePreFix(ProtocolPrefixes);
        var extractResult = FormattedStringValueExtracter.Extract(hostName, _domainFormat, ignoreCase: true);

        context.Handled = true;

        return Task.FromResult(extractResult.IsMatch ? extractResult.Matches[0].Value : null);
    }
}
