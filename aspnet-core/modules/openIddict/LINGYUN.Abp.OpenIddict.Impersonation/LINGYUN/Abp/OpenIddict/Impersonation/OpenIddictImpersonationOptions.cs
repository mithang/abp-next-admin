namespace LINGYUN.Abp.OpenIddict.Impersonation;

public class OpenIddictImpersonationOptions
{
    /// <summary>
    /// Kiểm tra quyền khi giả mạo người dùng
    /// </summary>
    public string? ImpersonationPermission {  get; set; }
    /// <summary>
    /// Kiểm tra quyền khi giả mạo tenant
    /// </summary>
    public string? ImpersonationTenantPermission { get; set; }
    /// <summary>
    /// Tên người dùng quản trị viên mặc định khi phía host giả mạo tenant
    /// </summary>
    public string DefaultTenantAdminUserName {  get; set; }
    public OpenIddictImpersonationOptions()
    {
        DefaultTenantAdminUserName = "admin";
    }
}
