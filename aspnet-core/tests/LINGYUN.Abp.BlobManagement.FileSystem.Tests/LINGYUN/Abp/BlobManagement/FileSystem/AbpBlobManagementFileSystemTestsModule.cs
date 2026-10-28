#nullable enable
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Modularity;

namespace LINGYUN.Abp.BlobManagement.FileSystem;

[DependsOn(
    typeof(AbpBlobManagementFileSystemModule),
    typeof(AbpBlobManagementDomainTestsModule))]
public class AbpBlobManagementFileSystemTestsModule : AbpModule
{
    /// <summary>
    /// Thư mục gốc kiểm thử (mỗi test host một thư mục)
    /// </summary>
    public static string RootPath { get; } = Path.Combine(
        Path.GetTempPath(),
        "LINGYUN.Abp.BlobManagement.FileSystem.Tests",
        Guid.NewGuid().ToString("N"));

    /// <summary>
    /// Thư mục gốc lưu trữ dùng cho kiểm thử (BlobManagement:FileSystem:BasePath)
    /// </summary>
    public static string BasePath { get; } = Path.Combine(RootPath, "blobs");

    /// <summary>
    /// Thư mục ngoài thư mục gốc lưu trữ, dùng để kiểm chứng truy cập vượt quyền sẽ bị từ chối
    /// </summary>
    public static string OutsidePath { get; } = Path.Combine(RootPath, "outside");

    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        // Để module production bật FileSystem provider theo cấu hình (BlobManagement:Provider)
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["BlobManagement:Provider"] = "FileSystem",
                ["BlobManagement:FileSystem:BasePath"] = BasePath,
            })
            .Build();

        context.Services.ReplaceConfiguration(configuration);

        Directory.CreateDirectory(BasePath);
        Directory.CreateDirectory(OutsidePath);
    }

    public override void OnApplicationShutdown(ApplicationShutdownContext context)
    {
        // Dọn dẹp thư mục kiểm thử
        if (Directory.Exists(RootPath))
        {
            Directory.Delete(RootPath, true);
        }

        // Thư mục ngoài sẽ được xóa cùng lúc khi trống sau khi tất cả test host kết thúc
        var parentPath = Path.GetDirectoryName(RootPath);
        if (parentPath != null &&
            Directory.Exists(parentPath) &&
            !Directory.EnumerateFileSystemEntries(parentPath).Any())
        {
            Directory.Delete(parentPath);
        }
    }
}
