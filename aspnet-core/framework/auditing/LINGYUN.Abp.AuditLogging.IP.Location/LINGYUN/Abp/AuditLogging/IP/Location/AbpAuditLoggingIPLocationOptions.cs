namespace LINGYUN.Abp.AuditLogging.IP.Location;

/// <summary>
/// Tùy chọn định vị IP cho nhật ký kiểm toán
/// </summary>
/// <remarks>
/// Phần cấu hình: <c>AuditLogging:IPLocation</c>
/// (Biến môi trường: <c>AuditLogging__IPLocation__IsEnabled</c>)
/// </remarks>
public class AbpAuditLoggingIPLocationOptions
{
    /// <summary>
    /// Có bật định vị IP hay không
    /// </summary>
    /// <remarks>
    /// Mặc định là <c>false</c>, cần bật tường minh trong cấu hình host (ví dụ docker-compose);
    /// Sau khi bật, kết quả phân giải sẽ được ghi vào thuộc tính <c>Location</c> của nhật ký kiểm toán và nhật ký bảo mật.
    /// </remarks>
    public bool IsEnabled { get; set; } = false;
}
