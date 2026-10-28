using System;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.BlobManagement.Dtos;

public class BlobDto : ExtensibleAuditedEntityDto<Guid>
{
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Tên đầy đủ
    /// </summary>
    public string FullName { get; set; } = default!;
    /// <summary>
    /// Loại
    /// </summary>
    public BlobType Type { get; set; }
    /// <summary>
    /// Loại nội dung
    /// </summary>
    public string? ContentType { get; set; }
    /// <summary>
    /// Kích thước tệp
    /// </summary>
    public long Size { get; set; }
    /// <summary>
    /// Thời gian hết hạn
    /// </summary>
    public DateTime? ExpirationTime { get; set; }
    /// <summary>
    /// Số lượt tải xuống
    /// </summary>
    public long DownloadCount { get; set; }
}
