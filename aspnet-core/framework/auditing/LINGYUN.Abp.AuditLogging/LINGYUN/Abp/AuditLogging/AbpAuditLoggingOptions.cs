using System.Collections.Generic;

namespace LINGYUN.Abp.AuditLogging;
public class AbpAuditLoggingOptions
{
    /// <summary>
    /// Có bật ghi nhật ký kiểm toán hay không
    /// </summary>
    public bool IsAuditLogEnabled { get; set; }
    /// <summary>
    /// Sử dụng hàng đợi nhật ký kiểm toán
    /// </summary>
    /// <remarks>
    /// Nếu không bật hàng đợi thì ghi trực tiếp vào cơ sở lưu trữ bền vững
    /// </remarks>
    public bool UseAuditLogQueue { get; set; }
    /// <summary>
    /// Kích thước tối đa của hàng đợi nhật ký kiểm toán
    /// </summary>
    public int MaxAuditLogQueueSize { get; set; }
    /// <summary>
    /// Kích thước xử lý hàng đợi nhật ký kiểm toán mỗi lần
    /// </summary>
    public int BatchAuditLogSize { get; set; }
    /// <summary>
    /// Danh sách contributor của nhật ký kiểm toán, dùng để sửa thuộc tính tùy chỉnh trước khi ghi
    /// </summary>
    public List<IAuditLogInfoContributor> AuditLogInfoContributors { get; }
    /// <summary>
    /// Có bật ghi nhật ký bảo mật hay không
    /// </summary>
    public bool IsSecurityLogEnabled { get; set; }
    /// <summary>
    /// Sử dụng hàng đợi nhật ký bảo mật
    /// </summary>
    /// <remarks>
    /// Nếu không bật hàng đợi thì ghi trực tiếp vào cơ sở lưu trữ bền vững
    /// </remarks>
    public bool UseSecurityLogQueue { get; set; }
    /// <summary>
    /// Kích thước tối đa của hàng đợi nhật ký bảo mật
    /// </summary>
    public int MaxSecurityLogQueueSize { get; set; }
    /// <summary>
    /// Kích thước xử lý hàng đợi nhật ký bảo mật mỗi lần
    /// </summary>
    public int BatchSecurityLogSize { get; set; }
    /// <summary>
    /// Danh sách contributor của nhật ký bảo mật, dùng để sửa thuộc tính tùy chỉnh trước khi ghi
    /// </summary>
    public List<ISecurityLogInfoContributor> SecurityLogInfoContributors { get; }
    public AbpAuditLoggingOptions()
    {
        IsAuditLogEnabled = true;
        UseAuditLogQueue = true;
        BatchAuditLogSize = 100;
        MaxAuditLogQueueSize = 10000;
        AuditLogInfoContributors = new List<IAuditLogInfoContributor>();

        IsSecurityLogEnabled = true;
        UseSecurityLogQueue = true;
        BatchSecurityLogSize = 100;
        MaxSecurityLogQueueSize = 10000;
        SecurityLogInfoContributors = new List<ISecurityLogInfoContributor>();
    }
}
