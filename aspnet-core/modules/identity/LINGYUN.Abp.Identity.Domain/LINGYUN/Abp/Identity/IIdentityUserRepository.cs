using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Identity;

namespace LINGYUN.Abp.Identity;

public interface IIdentityUserRepository : Volo.Abp.Identity.IIdentityUserRepository
{
    /// <summary>
    /// Số điện thoại đã được sử dụng hay chưa
    /// </summary>
    /// <param name="phoneNumber"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> IsPhoneNumberUedAsync(
        string phoneNumber,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Số điện thoại đã được xác nhận (liên kết) hay chưa
    /// </summary>
    /// <param name="phoneNumber"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> IsPhoneNumberConfirmedAsync(
        string phoneNumber,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Địa chỉ email đã được xác nhận (liên kết) hay chưa
    /// </summary>
    /// <param name="normalizedEmail"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> IsNormalizedEmailConfirmedAsync(
       string normalizedEmail,
       CancellationToken cancellationToken = default);
    /// <summary>
    /// Tra cứu người dùng theo số điện thoại
    /// </summary>
    /// <param name="phoneNumber">Số điện thoại</param>
    /// <param name="isConfirmed">Đã xác nhận hay chưa</param>
    /// <param name="includeDetails"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<IdentityUser?> FindByPhoneNumberAsync(
        string phoneNumber,
        bool isConfirmed = true,
        bool includeDetails = false,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy người dùng theo danh sách khóa chính của người dùng
    /// </summary>
    /// <param name="userIds"></param>
    /// <param name="includeDetails"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<IdentityUser>> GetListByIdListAsync(
        List<Guid> userIds,
        bool includeDetails = false,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Lấy danh sách tất cả các đơn vị tổ chức của người dùng
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="filter"></param>
    /// <param name="includeDetails"></param>
    /// <param name="skipCount"></param>
    /// <param name="maxResultCount"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<OrganizationUnit>> GetOrganizationUnitsAsync(
        Guid userId, 
        string? filter = null,
        bool includeDetails = false, 
        int skipCount = 1, 
        int maxResultCount = 10, 
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// 
    /// </summary>
    /// <param name="organizationUnitId"></param>
    /// <param name="filter"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<long> GetUsersInOrganizationUnitCountAsync(
        Guid organizationUnitId,
        string? filter = null,
        CancellationToken cancellationToken = default
    );

    Task<List<IdentityUser>> GetUsersInOrganizationUnitAsync(
        Guid organizationUnitId,
        string? filter = null,
        int skipCount = 1,
        int maxResultCount = 10,
        CancellationToken cancellationToken = default
    );

    Task<long> GetUsersInOrganizationsListCountAsync(
        List<Guid> organizationUnitIds,
        string? filter = null,
        CancellationToken cancellationToken = default
    );

    Task<List<IdentityUser>> GetUsersInOrganizationsListAsync(
        List<Guid> organizationUnitIds,
        string? filter = null,
        int skipCount = 1,
        int maxResultCount = 10,
        CancellationToken cancellationToken = default
    );

    Task<long> GetUsersInOrganizationUnitWithChildrenCountAsync(
        string code,
        string? filter = null,
        CancellationToken cancellationToken = default
    );

    Task<List<IdentityUser>> GetUsersInOrganizationUnitWithChildrenAsync(
        string code,
        string? filter = null,
        int skipCount = 1,
        int maxResultCount = 10,
        CancellationToken cancellationToken = default
    );
}
