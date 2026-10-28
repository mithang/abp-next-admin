using DotNetCore.CAP;
using DotNetCore.CAP.Internal;
using DotNetCore.CAP.Serialization;
using LINGYUN.Abp.EventBus.CAP;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;

namespace Microsoft.Extensions.DependencyInjection;

/// <summary>
/// CAP ServiceCollectionExtensions
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds and configures the consistence services for the consistency.
    /// </summary>
    /// <param name="services"></param>
    /// <param name="capAction"></param>
    /// <returns></returns>
    public static IServiceCollection AddCAPEventBus(this IServiceCollection services, Action<CapOptions> capAction)
    {
        services.AddCap(capAction);
        // Thay bằng triển khai của riêng mình
        services.AddSingleton<ISubscribeInvoker, AbpCAPSubscribeInvoker>();
        services.AddSingleton<ISerializer, AbpCapSerializer>();

        // Gỡ bỏ giao diện khởi động CAP mặc định
        services.RemoveAll(service =>
        {
            if (service.ServiceType.IsAssignableFrom(typeof(IBootstrapper)))
            {
                return true;
            }
            // Bootstrapper mặc định
            if (service.ImplementationType != null &&
                service.ImplementationType.IsAssignableTo(typeof(IBootstrapper)))
            {
                return true;
            }
            // Bootstrapper HostService mặc định
            if (service.ImplementationFactory != null &&
                service.ImplementationFactory.Method.ReturnType.IsAssignableTo(typeof(IBootstrapper)))
            {
                return true;
            }

            return false;
        });
        // Dùng giao diện đã ghi đè, không dùng BackgroundService
        services.AddSingleton<AbpCAPBootstrapper>();
        services.AddSingleton<IBootstrapper>(sp => sp.GetRequiredService<AbpCAPBootstrapper>());

        return services;
    }
}
