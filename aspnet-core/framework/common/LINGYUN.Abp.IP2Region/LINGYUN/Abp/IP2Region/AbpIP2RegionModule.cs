using IP2Region.Net.Abstractions;
using LINGYUN.Abp.IP.Location;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using Volo.Abp;
using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;

namespace LINGYUN.Abp.IP2Region;

[DependsOn(typeof(AbpIPLocationModule))]
[DependsOn(typeof(AbpVirtualFileSystemModule))]
public class AbpIP2RegionModule : AbpModule
{
    /// <summary>
    /// Thư viện ngoại tuyến IPv4 tích hợp sẵn (đường dẫn hệ thống tệp ảo)
    /// </summary>
    public const string DefaultIPv4DatabaseFile = "/LINGYUN/Abp/IP2Region/Resources/ip2region_v4.xdb";

    /// <summary>
    /// Thư viện ngoại tuyến IPv6 tích hợp sẵn (đường dẫn hệ thống tệp ảo)
    /// </summary>
    public const string DefaultIPv6DatabaseFile = "/LINGYUN/Abp/IP2Region/Resources/ip2region_v6.xdb";

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();

        Configure<AbpIP2RegionOptions>(configuration.GetSection("IP2Region"));

        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<AbpIP2RegionModule>();
        });

        context.Services.AddSingleton<ISearcher>((serviceProvider) =>
        {
            var options = serviceProvider.GetRequiredService<IOptions<AbpIP2RegionOptions>>().Value;

            // Ưu tiên tệp vật lý, thuận tiện cho việc thay thế/cập nhật thư viện ngoại tuyến; nếu không sẽ dùng tài nguyên tích hợp sẵn
            var ipv4XdbStream = CreateDatabaseStream(serviceProvider, options.IPv4DatabaseFile, true);

            // Tệp dữ liệu IPv6 khá lớn và là tùy chọn (có thể giảm kích thước bằng cách loại trừ tài nguyên này khi đóng gói), nếu không tồn tại sẽ không tải, truy vấn IPv6 trả về null
            var ipv6XdbStream = CreateDatabaseStream(serviceProvider, options.IPv6DatabaseFile, false);

            // Tự động chọn tệp dữ liệu theo họ địa chỉ
            return new AbpSearcher(options.CachePolicy, ipv4XdbStream!, ipv6XdbStream);
        });

        Configure<AbpIPLocationResolveOptions>(options =>
        {
            options.IPLocationResolvers.Add(new IP2RegionIPLocationResolveContributor());
        });
    }

    /// <summary>
    /// Tạo luồng dữ liệu của thư viện ngoại tuyến
    /// </summary>
    /// <remarks>
    /// Ưu tiên tệp vật lý, tiếp theo là đường dẫn hệ thống tệp ảo (tài nguyên tích hợp sẵn)
    /// </remarks>
    private static Stream? CreateDatabaseStream(IServiceProvider serviceProvider, string databaseFile, bool required)
    {
        if (File.Exists(databaseFile))
        {
            return File.OpenRead(databaseFile);
        }

        var virtualFileProvider = serviceProvider.GetRequiredService<IVirtualFileProvider>();
        var databaseFileInfo = virtualFileProvider.GetFileInfo(databaseFile);
        if (databaseFileInfo.Exists)
        {
            return databaseFileInfo.CreateReadStream();
        }

        if (required)
        {
            throw new AbpException(
                $"IP2Region database file not found: {databaseFile}. " +
                "Please check the IP2Region:IPv4DatabaseFile option or the embedded ip2region_v4.xdb resource.");
        }

        return null;
    }
}
