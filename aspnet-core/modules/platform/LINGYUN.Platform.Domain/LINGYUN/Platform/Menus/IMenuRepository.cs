using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace LINGYUN.Platform.Menus;

public interface IMenuRepository : IBasicRepository<Menu, Guid>
{
    Task<List<Menu>> GetListAsync(
        IEnumerable<Guid> idList,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy menu cuối cùng
    /// </summary>
    /// <param name="parentId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Menu?> FindLastMenuAsync(
        Guid? parentId = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn menu theo tên
    /// </summary>
    /// <param name="menuName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Menu?> FindByNameAsync(
        string menuName,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn menu chính, mỗi khi tạo một trang bố cục đều phải tạo menu chính có đường dẫn là /
    /// </summary>
    /// <param name="platformType"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<Menu?> FindMainAsync(
        string? framework = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy nút con
    /// </summary>
    /// <param name="parentId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<Menu>> GetChildrenAsync(
        Guid? parentId,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Truy vấn menu con theo mã của menu cha
    /// </summary>
    /// <param name="code"></param>
    /// <param name="parentId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<Menu>> GetAllChildrenWithParentCodeAsync(
        string code,
        Guid? parentId,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Tìm các menu mà người dùng có thể truy cập
    /// </summary>
    /// <param name="userId">Định danh người dùng</param>
    /// <param name="roles">Danh sách vai trò</param>
    /// <param name="platformType">Loại nền tảng</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<Menu>> GetUserMenusAsync(
        Guid userId,
        string[] roles,
        string? framework = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Tìm các menu mà vai trò có thể truy cập
    /// </summary>
    /// <param name="roles">Danh sách vai trò</param>
    /// <param name="platformType">Loại nền tảng</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<Menu>> GetRoleMenusAsync(
        string[] roles,
        string? framework = null,
        CancellationToken cancellationToken = default);

    Task<int> GetCountAsync(
        string? filter =null,
        string? framework = null,
        Guid? parentId = null,
        Guid? layoutId = null,
        CancellationToken cancellationToken = default);

    Task<List<Menu>> GetListAsync(
        string? filter = null,
        string? framework = null,
        Guid? parentId = null,
        Guid? layoutId = null,
        string? sorting = nameof(Menu.Code),
        int skipCount = 0,
        int maxResultCount = 10,
        CancellationToken cancellationToken = default);

    Task<List<Menu>> GetAllAsync(
        string? filter = null,
        string? framework = null,
        Guid? parentId = null,
        Guid? layoutId = null,
        string? sorting = nameof(Menu.Code),
        CancellationToken cancellationToken = default);

    Task RemoveAllRolesAsync(
        Menu menu,
        CancellationToken cancellationToken = default
    );

    Task RemoveAllMembersAsync(
        Menu menu,
        CancellationToken cancellationToken = default
    );
}
