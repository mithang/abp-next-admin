using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LINGYUN.Abp.IM;

/// <summary>
/// Giao diện tra cứu hồ sơ người dùng IM
/// </summary>
public interface IUserCardFinder
{
    /// <summary>
    /// Truy vấn số lượng người dùng IM
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="findUserName">Tên người dùng</param>
    /// <param name="startAge">Tuổi bắt đầu</param>
    /// <param name="endAge">Tuổi kết thúc</param>
    /// <param name="sex">Giới tính</param>
    /// <returns></returns>
    Task<int> GetCountAsync(
        Guid? tenantId,
        string? findUserName = null,
        int? startAge = null,
        int? endAge = null,
        Sex? sex = null);
    /// <summary>
    /// Truy vấn danh sách người dùng IM
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="findUserName">Tên người dùng</param>
    /// <param name="startAge">Tuổi bắt đầu</param>
    /// <param name="endAge">Tuổi kết thúc</param>
    /// <param name="sex">Giới tính</param>
    /// <param name="sorting">Trường sắp xếp</param>
    /// <param name="skipCount">Vị trí bản ghi bắt đầu</param>
    /// <param name="maxResultCount">Số lượng tối đa trả về</param>
    /// <returns></returns>
    Task<List<UserCard>> GetListAsync(
        Guid? tenantId,
        string? findUserName = null,
        int? startAge = null,
        int? endAge = null,
        Sex? sex = null,
        string sorting = nameof(UserCard.UserId),
        int skipCount = 0,
        int maxResultCount = 10);
    /// <summary>
    /// Lấy thông tin người dùng IM
    /// </summary>
    /// <param name="tenantId"></param>
    /// <param name="findUserId"></param>
    /// <returns></returns>
    Task<UserCard?> GetMemberAsync(
        Guid? tenantId,
        Guid findUserId);
}
