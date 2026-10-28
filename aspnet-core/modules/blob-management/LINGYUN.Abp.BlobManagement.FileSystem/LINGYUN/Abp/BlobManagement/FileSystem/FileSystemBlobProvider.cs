using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.BlobStoring;
using Volo.Abp.BlobStoring.FileSystem;
using Volo.Abp.IO;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.BlobManagement.FileSystem;

public class FileSystemBlobProvider : IBlobProvider
{
    public const string ProviderName = "FileSystem";
    public string Name => ProviderName;

    protected ICurrentTenant CurrentTenant { get; }
    protected FileSystemBlobNamingNormalizer BlobNamingNormalizer { get; }
    protected IBlobContainerConfigurationProvider ConfigurationProvider { get; }

    public FileSystemBlobProvider(
        ICurrentTenant currentTenant,
        FileSystemBlobNamingNormalizer blobNamingNormalizer,
        IBlobContainerConfigurationProvider configurationProvider)
    {
        CurrentTenant = currentTenant;
        BlobNamingNormalizer = blobNamingNormalizer;
        ConfigurationProvider = configurationProvider;
    }

    public virtual Task CreateContainerAsync(
        string name,
        CancellationToken cancellationToken = default)
    {
        var filePath = CalculateBlobName(NormalizeContainerName(name));

        DirectoryHelper.CreateIfNotExists(filePath);

        return Task.CompletedTask;
    }

    public virtual Task DeleteContainerAsync(
        string name,
        CancellationToken cancellationToken = default)
    {
        var filePath = CalculateBlobName(NormalizeContainerName(name));

        DirectoryHelper.DeleteIfExists(filePath);

        return Task.CompletedTask;
    }

    public virtual Task DeleteBlobAsync(
        string containerName,
        string blobName,
        CancellationToken cancellationToken = default)
    {
        var fileName = CalculateBlobName(NormalizeContainerName(containerName.RemovePostFix("/")), blobName);

        FileHelper.DeleteIfExists(fileName);

        return Task.CompletedTask;
    }

    public virtual Task DeleteFolderAsync(
        string containerName,
        string blobName,
        CancellationToken cancellationToken = default)
    {
        var filePath = CalculateBlobName(NormalizeContainerName(containerName.RemovePostFix("/")), blobName);

        var children = Directory.GetFileSystemEntries(filePath);
        if (children.Length > 0)
        {
            throw new BusinessException(
                BlobManagementErrorCodes.Blob.DeleteWithNotEmpty,
                "The current directory is not empty and cannot be deleted!");
        }

        DirectoryHelper.DeleteIfExists(filePath);

        return Task.CompletedTask;
    }

    public virtual Task<Stream?> DownloadBlobAsync(
        string containerName,
        string blobName,
        CancellationToken cancellationToken = default)
    {
        var fileName = CalculateBlobName(NormalizeContainerName(containerName.RemovePostFix("/")), blobName);

        if (!File.Exists(fileName))
        {
            return Task.FromResult<Stream?>(null);
        }

        return Task.FromResult<Stream?>(File.OpenRead(fileName));
    }

    public virtual Task<string?> GeneratePresignedUrlAsync(
        string containerName,
        string blobName,
        TimeSpan expiration,
        bool isAttachmentContent = true,
        CancellationToken cancellationToken = default)
    {
        // Hệ thống tệp cục bộ không cần tạo liên kết tải xuống
        return Task.FromResult<string?>(null);
    }

    public virtual Task CreateFolderAsync(
        string containerName, 
        string blobName,
        CancellationToken cancellationToken = default)
    {
        var filePath = CalculateBlobName(NormalizeContainerName(containerName.RemovePostFix("/")), blobName);

        DirectoryHelper.CreateIfNotExists(filePath);

        return Task.CompletedTask;
    }

    public async virtual Task UploadBlobAsync(
        string containerName, 
        string blobName, 
        Stream content,
        string? contentType = null,
        CancellationToken cancellationToken = default)
    {
        var fileName = CalculateBlobName(NormalizeContainerName(containerName.RemovePostFix("/")), blobName);

        DirectoryHelper.CreateIfNotExists(Path.GetDirectoryName(fileName)!);

        using var fileStream = File.Open(fileName, FileMode.Create, FileAccess.ReadWrite);

        await content.CopyToAsync(fileStream, cancellationToken);

        await fileStream.FlushAsync(cancellationToken);
    }

    protected virtual FileSystemBlobProviderConfiguration GetBlobConfiguration()
    {
        var configuration = ConfigurationProvider.Get<BlobManagementContainer>();
        var blobConfiguration = configuration.GetFileSystemConfiguration();
        return blobConfiguration;
    }

    protected virtual string NormalizeContainerName(string containerName)
    {
        if (!containerName.StartsWith("abp-"))
        {
            containerName = "abp-" + containerName;
        }
        return BlobNamingNormalizer.NormalizeContainerName(containerName);
    }

    /// <summary>
    /// Cách so sánh đường dẫn
    /// </summary>
    /// <remarks>
    /// Windows và macOS (mặc định APFS/HFS+) không phân biệt chữ hoa chữ thường, còn Linux và các hệ thống tệp kiểu Unix phân biệt chữ hoa chữ thường:
    /// Việc dùng phép so sánh không phân biệt chữ hoa chữ thường trên hệ thống tệp phân biệt chữ hoa chữ thường sẽ bỏ qua các thư mục anh em chỉ khác nhau ở chữ hoa/thường
    /// </remarks>
    protected static StringComparison PathComparison =>
        OperatingSystem.IsWindows() || OperatingSystem.IsMacOS()
            ? StringComparison.OrdinalIgnoreCase
            : StringComparison.Ordinal;

    /// <summary>
    /// Các ký tự không được phép xuất hiện trong tên
    /// </summary>
    /// <remarks>
    /// Sử dụng tường minh hợp của các ký tự không hợp lệ trên từng nền tảng (thay vì <see cref="Path.GetInvalidFileNameChars"/>):
    /// Tên tệp kiểu Unix cho phép các ký tự như ':', nhưng cùng một dữ liệu có thể được máy chủ Windows, chia sẻ SMB,
    /// hoặc các blob provider khác tái sử dụng, vì vậy thống nhất từ chối theo quy tắc có thể di chuyển
    /// </remarks>
    protected static readonly char[] InvalidNameCharacters =
    [
        '\0', '/', '\\', ':', '*', '?', '"', '<', '>', '|',
    ];

    protected virtual string CalculateBlobName(string bucketName, string blobName = "")
    {
        var blobConfiguration = GetBlobConfiguration();
        var basePath = Path.GetFullPath(blobConfiguration.BasePath);

        // Thư mục gốc lưu trữ của tenant hiện tại: máy chủ là host, tenant là tenants/{tenantId}
        string tenantPath;
        if (CurrentTenant.Id == null)
        {
            tenantPath = Path.Combine(basePath, "host");
        }
        else
        {
            tenantPath = Path.Combine(basePath, "tenants", CurrentTenant.Id.Value.ToString("D"));
        }
        DirectoryHelper.CreateIfNotExists(tenantPath);

        var blobPath = tenantPath;

        if (blobConfiguration.AppendContainerNameToBasePath &&
            !bucketName.IsNullOrWhiteSpace())
        {
            CheckContainerName(bucketName);

            blobPath = Path.Combine(blobPath, bucketName);
        }
        if (!blobName.IsNullOrWhiteSpace())
        {
            // Tên đầy đủ của bộ nhớ mô-đun có thể bắt đầu bằng / (ví dụ /abp-container/folder/file.txt)
            var name = blobName.RemovePreFix("/");
            CheckBlobName(name);

            blobPath = Path.Combine(blobPath, name);
        }

        // Quan trọng: sau khi phân tích .. / đường dẫn tuyệt đối / biến thể dấu phân tách, kết quả vẫn phải nằm trong thư mục tenant hiện tại
        // (Path.GetFullPath sẽ loại bỏ .., vì vậy việc chèn đường dẫn tuyệt đối cũng sẽ bị chặn)
        var fullPath = Path.GetFullPath(blobPath);
        var tenantRoot = tenantPath.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar)
            + Path.DirectorySeparatorChar;

        if (!fullPath.StartsWith(tenantRoot, PathComparison))
        {
            throw BlobManagementNameValidator.CreateInvalidNameException(
                blobName,
                BlobManagementErrorCodes.Blob.InvalidName);
        }

        return fullPath;
    }

    /// <summary>
    /// Kiểm tra tên container
    /// </summary>
    /// <remarks>
    /// Tên container phải là một tên thư mục duy nhất: tên chứa dấu phân tách sẽ không thoát khỏi thư mục tenant (phép kiểm tra containment không chặn được),
    /// nhưng sẽ được phân tích thành thư mục container khác trong cùng tenant (bí danh container), từ đó vượt qua sự cô lập container.
    /// </remarks>
    protected virtual void CheckContainerName(string containerName)
    {
        if (containerName.IsNullOrWhiteSpace())
        {
            return;
        }

        BlobManagementNameValidator.CheckName(containerName, BlobManagementErrorCodes.Container.InvalidName);
    }

    /// <summary>
    /// Kiểm tra tên tệp/thư mục (đường dẫn)
    /// </summary>
    /// <remarks>
    /// Quy tắc nhất quán với thực thể; đây chỉ là phòng thủ theo chiều sâu, ranh giới an toàn thực sự là phép kiểm tra containment của <see cref="CalculateBlobName"/>
    /// (Phép kiểm tra tên không bao phủ được liên kết tượng trưng/điểm nối).
    /// </remarks>
    protected virtual void CheckBlobName(string blobName)
    {
        if (blobName.IsNullOrWhiteSpace())
        {
            return;
        }

        BlobManagementNameValidator.CheckPath(blobName, BlobManagementErrorCodes.Blob.InvalidName);
    }
}
