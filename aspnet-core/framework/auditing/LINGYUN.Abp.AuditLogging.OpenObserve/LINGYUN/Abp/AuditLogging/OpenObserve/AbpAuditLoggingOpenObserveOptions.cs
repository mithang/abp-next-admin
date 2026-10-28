namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Tùy chọn OpenObserve cho nhật ký kiểm toán
/// </summary>
/// <remarks>
/// Phần cấu hình: <c>AuditLogging:OpenObserve</c>
/// </remarks>
public class AbpAuditLoggingOpenObserveOptions
{
    /// <summary>
    /// Luồng dữ liệu nhật ký kiểm toán mặc định
    /// </summary>
    public const string DefaultAuditLogStream = "audit_log";
    /// <summary>
    /// Luồng dữ liệu nhật ký bảo mật mặc định
    /// </summary>
    public const string DefaultSecurityLogStream = "security_log";
    /// <summary>
    /// Hậu tố luồng dữ liệu thay đổi thực thể
    /// </summary>
    public const string EntityChangeStreamSuffix = "_entity_changes";
    /// <summary>
    /// Hậu tố luồng dữ liệu thao tác
    /// </summary>
    public const string ActionStreamSuffix = "_actions";

    /// <summary>
    /// Tên tổ chức
    /// </summary>
    /// <remarks>
    /// Khi không chỉ định thì dùng <c>AbpOpenObserveOptions.Organization</c>
    /// </remarks>
    public string? Organization { get; set; }
    /// <summary>
    /// Tên luồng dữ liệu nhật ký kiểm toán
    /// </summary>
    public string AuditLogStream { get; set; }
    /// <summary>
    /// Tên luồng dữ liệu nhật ký bảo mật
    /// </summary>
    public string SecurityLogStream { get; set; }
    /// <summary>
    /// Có ghi thay đổi thực thể dưới dạng phẳng hay không
    /// </summary>
    /// <remarks>
    /// Mặc định true; khi tắt, <c>IEntityChangeStore</c> sẽ không truy vấn được dữ liệu
    /// </remarks>
    public bool WriteEntityChanges { get; set; }
    /// <summary>
    /// Có ghi thao tác dưới dạng phẳng hay không
    /// </summary>
    /// <remarks>
    /// Mặc định true; khi tắt, truy vấn theo <c>Actions.*</c> điều kiện sẽ không khớp
    /// </remarks>
    public bool WriteActions { get; set; }
    /// <summary>
    /// Khoảng truy vấn mặc định (ngày) khi không chỉ định phạm vi thời gian
    /// </summary>
    /// <remarks>
    /// Truy vấn OpenObserve bắt buộc phải chỉ định phạm vi thời gian, mặc định 365 ngày
    /// </remarks>
    public int DefaultQueryDays { get; set; }
    /// <summary>
    /// Có dùng thời gian nghiệp vụ của chính nhật ký để ghi đè <c>_timestamp</c>
    /// </summary>
    /// <remarks>
    /// Mặc định true: nhật ký kiểm toán dùng <c>AuditLog.ExecutionTime</c>, nhật ký bảo mật dùng <c>SecurityLog.CreationTime</c>,
    /// thay đổi thực thể dùng <c>EntityChange.ChangeTime</c>, thao tác dùng <c>AuditLogAction.ExecutionTime</c>
    /// </remarks>
    public bool UseLogTimeAsTimestamp { get; set; }
    /// <summary>
    /// Số giờ hồi tố tối đa được phép ghi đè <c>_timestamp</c> 
    /// </summary>
    /// <remarks>
    /// OpenObserve mặc định chỉ chấp nhận dữ liệu trong vòng <c>ZO_INGEST_ALLOWED_UPTO</c>(mặc định 5) giờ, dữ liệu vượt quá cửa sổ sẽ bị phía máy chủ loại bỏ,
    /// do đó nhật ký vượt quá cửa sổ đó sẽ không còn ghi đè <c>_timestamp</c>(mà dùng thời gian ghi phía máy chủ); cần giữ nhất quán với biến môi trường phía máy chủ
    /// </remarks>
    public int TimestampAllowedUptoHours { get; set; }

    public AbpAuditLoggingOpenObserveOptions()
    {
        AuditLogStream = DefaultAuditLogStream;
        SecurityLogStream = DefaultSecurityLogStream;

        WriteEntityChanges = true;
        WriteActions = true;
        DefaultQueryDays = 365;
        UseLogTimeAsTimestamp = true;
        TimestampAllowedUptoHours = 5;
    }

    /// <summary>
    /// Lấy tên luồng dữ liệu thay đổi thực thể
    /// </summary>
    /// <remarks>
    /// Được tính từ <see cref="AuditLogStream"/> tính ra: <c>{AuditLogStream}_entity_changes</c>, không cần cấu hình riêng
    /// </remarks>
    public virtual string GetEntityChangeStream()
    {
        return $"{AuditLogStream}{EntityChangeStreamSuffix}";
    }

    /// <summary>
    /// Lấy tên luồng dữ liệu thao tác
    /// </summary>
    /// <remarks>
    /// Được tính từ <see cref="AuditLogStream"/> tính ra: <c>{AuditLogStream}_actions</c>, không cần cấu hình riêng;
    /// Thao tác có dung lượng lớn (parameters có thể rất lớn) được ghi vào luồng dữ liệu riêng, khi truy vấn sẽ khớp trước trong luồng dữ liệu đó rồi quay lại luồng dữ liệu chính để lọc theo id
    /// </remarks>
    public virtual string GetActionStream()
    {
        return $"{AuditLogStream}{ActionStreamSuffix}";
    }
}
