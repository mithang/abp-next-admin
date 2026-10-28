using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Models.User;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Tạo người dùng
    /// </summary>
    /// <remarks>
    /// POST /api/{organization}/users
    /// Tham khảo: https://openobserve.ai/docs/reference/api/user/create/
    /// </remarks>
    /// <param name="email">Email</param>
    /// <param name="password">Mật khẩu</param>
    /// <param name="role">Vai trò: admin / user</param>
    public async virtual Task<OpenObserveCodeMessageResponse> CreateUserAsync(
        string email,
        string password,
        string? firstName = null,
        string? lastName = null,
        string? role = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/users";

        var request = new CreateUserRequest
        {
            Email = email,
            Password = password,
            FirstName = firstName,
            LastName = lastName,
            Role = role,
        };

        return (await PostJsonAsync<CreateUserRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Cập nhật người dùng
    /// </summary>
    /// <remarks>
    /// PUT /api/{organization}/users/{user_email}
    /// Khi không thay đổi mật khẩu, đừng truyền oldPassword / newPassword
    /// Tham khảo: https://openobserve.ai/docs/reference/api/user/create/
    /// </remarks>
    public async virtual Task<OpenObserveCodeMessageResponse> UpdateUserAsync(
        string userEmail,
        string? firstName = null,
        string? lastName = null,
        string? oldPassword = null,
        string? newPassword = null,
        string? role = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/users/{Uri.EscapeDataString(userEmail)}";

        var request = new UpdateUserRequest
        {
            FirstName = firstName,
            LastName = lastName,
            OldPassword = oldPassword,
            NewPassword = newPassword,
            Role = role,
        };

        return (await PutJsonAsync<UpdateUserRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Thêm người dùng đã có vào tổ chức
    /// </summary>
    /// <remarks>
    /// POST /api/{organization}/users/{user_email}
    /// Tham khảo: https://openobserve.ai/docs/reference/api/user/create/
    /// </remarks>
    /// <param name="role">Vai trò: admin / user</param>
    public async virtual Task<OpenObserveCodeMessageResponse> AddUserToOrganizationAsync(
        string userEmail,
        string? role = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/users/{Uri.EscapeDataString(userEmail)}";

        var request = new AddUserToOrganizationRequest
        {
            Role = role,
        };

        return (await PostJsonAsync<AddUserToOrganizationRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Xóa người dùng khỏi tổ chức
    /// </summary>
    /// <remarks>
    /// DELETE /api/{organization}/users/{user_email}
    /// Tham khảo: https://openobserve.ai/docs/reference/api/user/delete/
    /// </remarks>
    public async virtual Task<OpenObserveCodeMessageResponse> RemoveUserFromOrganizationAsync(
        string userEmail,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/users/{Uri.EscapeDataString(userEmail)}";

        return (await DeleteAsync<OpenObserveCodeMessageResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Liệt kê người dùng trong tổ chức
    /// </summary>
    /// <remarks>
    /// GET /api/{organization}/users
    /// Tham khảo: https://openobserve.ai/docs/reference/api/user/list/
    /// </remarks>
    public async virtual Task<UserListResponse> GetUsersAsync(
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/users";

        return (await GetAsync<UserListResponse>(requestUri, cancellationToken: cancellationToken))!;
    }
}
