namespace LINGYUN.Abp.Saas;

public static class AbpSaasErrorCodes
{
    public const string Namespace = "Saas";
    /// <summary>
    /// Đã tồn tại phiên bản có tên hiển thị là {DisplayName}!
    /// </summary>
    public const string DuplicateEditionDisplayName = Namespace + ":010001";
    /// <summary>
    /// Đang cố xóa phiên bản đang được sử dụng: {DisplayName}!
    /// </summary>
    public const string DeleteUsedEdition = Namespace + ":010002";
    /// <summary>
    /// Đã tồn tại tenant có tên là {Name}!
    /// </summary>
    public const string DuplicateTenantName = Namespace + ":020001";
    /// <summary>
    /// Tenant: {Tenant} không tồn tại!
    /// </summary>
    public const string TenantIdOrNameNotFound = Namespace + ":020002";
    /// <summary>
    /// Không thể mở kết nối cơ sở dữ liệu mà chuỗi kết nối mặc định trỏ tới
    /// </summary>
    public const string InvalidDefaultConnectionString = Namespace + ":020101";
    /// <summary>
    /// Cơ sở dữ liệu mà chuỗi kết nối mặc định trỏ tới đã tồn tại
    /// </summary>
    public const string DefaultConnectionStringDatabaseExists = Namespace + ":020102";
    /// <summary>
    /// Chuỗi kết nối của {Name} không hợp lệ
    /// </summary>
    public const string InvalidConnectionString = Namespace + ":020103";
    /// <summary>
    /// Không hỗ trợ kiểm tra kết nối cơ sở dữ liệu thuộc loại {Name}
    /// </summary>
    public const string ConnectionStringProviderNotSupport = Namespace + ":020104";
}
