using LINGYUN.Abp.Identity.Session;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Microsoft.Extensions.DependencyInjection;
public static class IdentitySessionServiceCollectionExtensions
{
    /// <summary>
    /// Cho phép phiên làm việc bất kỳ
    /// </summary>
    /// <remarks>
    /// Trong một số trường hợp, cấu hình bộ nhớ đệm có thể khác nhau, có thể không kiểm tra bộ nhớ đệm phiên làm việc
    /// </remarks>
    /// <param name="services"></param>
    /// <returns></returns>
    public static IServiceCollection AddAlwaysAllowSession(this IServiceCollection services)
    {
        services.Replace(
            ServiceDescriptor.Singleton<IIdentitySessionChecker, AllowAnonymousIdentitySessionChecker>());

        return services;
    }
}
