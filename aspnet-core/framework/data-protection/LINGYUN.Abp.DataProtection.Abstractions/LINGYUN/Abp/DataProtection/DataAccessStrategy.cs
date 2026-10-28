namespace LINGYUN.Abp.DataProtection;
/// <summary>
/// Chính sách truy cập dữ liệu
/// </summary>
public enum DataAccessStrategy
{
    /// <summary>
    /// Có thể truy cập mọi dữ liệu
    /// </summary>
    All,
    /// <summary>
    /// Quy tắc tùy chỉnh
    /// </summary>
    Custom,
    /// <summary>
    /// Chỉ người dùng hiện tại
    /// </summary>
    CurrentUser,
    /// <summary>
    /// Chỉ vai trò người dùng hiện tại
    /// </summary>
    CurrentRoles,
    /// <summary>
    /// Chỉ tổ chức của người dùng hiện tại
    /// </summary>
    CurrentOrganizationUnits,
    /// <summary>
    /// Chỉ tổ chức của người dùng hiện tại và các tổ chức cấp dưới
    /// </summary>
    CurrentAndSubOrganizationUnits,
}
