using LINGYUN.Abp.IP.Location;
using MaxMind.GeoIP2;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.MaxMindGeoIP2;

/// <summary>
/// Mô-đun MaxMind GeoIP2
/// </summary>
/// <remarks>
/// Thư viện ngoại tuyến (GeoLite2-City.mmdb) chịu ràng buộc giấy phép của MaxMind, không do mô-đun này phân phối:
/// Bên sử dụng cần chỉ định đường dẫn tệp qua <c>MaxMindGeoIP2:DatabaseFile</c>,
/// Khi tệp không tồn tại, dùng <see cref="EmptyGeoIP2DatabaseReader"/> và ghi nhật ký cảnh báo
/// </remarks>
[DependsOn(typeof(AbpIPLocationModule))]
public class AbpMaxMindGeoIP2Module : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();

        Configure<AbpMaxMindGeoIP2Options>(configuration.GetSection("MaxMindGeoIP2"));

        Configure<AbpIPLocationResolveOptions>(options =>
        {
            options.IPLocationResolvers.Add(new MaxMindGeoIP2IPLocationResolveContributor());
        });

        context.Services.AddSingleton<IGeoIP2DatabaseReader>((serviceProvider) =>
        {
            var options = serviceProvider.GetRequiredService<IOptions<AbpMaxMindGeoIP2Options>>().Value;
            var logger = serviceProvider.GetService<ILogger<AbpMaxMindGeoIP2Module>>();

            if (options.DatabaseFileExists())
            {
                logger?.LogInformation(
                    "The MaxMind GeoIP2 database was loaded from {DatabaseFile} with {FileAccessMode}.",
                    options.DatabaseFile,
                    options.FileAccessMode);

                return new DatabaseReader(options.DatabaseFile, options.FileAccessMode);
            }

            // Khi chưa cung cấp thư viện ngoại tuyến (hoặc tệp không tồn tại), dùng trình đọc rỗng để tránh làm gián đoạn nghiệp vụ
            logger?.LogWarning(
                "The MaxMind GeoIP2 database file was not found: {DatabaseFile}, " +
                "IP location resolution will return empty results. " +
                "Download a GeoLite2 database from MaxMind (its license applies) " +
                "and set MaxMindGeoIP2:DatabaseFile.",
                options.DatabaseFile);

            return new EmptyGeoIP2DatabaseReader();
        });
    }
}
