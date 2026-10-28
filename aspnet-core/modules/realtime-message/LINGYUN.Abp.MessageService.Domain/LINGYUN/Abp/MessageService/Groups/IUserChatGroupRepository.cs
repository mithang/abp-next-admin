using LINGYUN.Abp.IM.Groups;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace LINGYUN.Abp.MessageService.Groups;

public interface IUserChatGroupRepository : IBasicRepository<UserChatGroup, long>
{
    /// <summary>
    /// Thành viên có trong nhóm hay không
    /// </summary>
    /// <param name="id"></param>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<bool> MemberHasInGroupAsync(
        long groupId,
        Guid userId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy thành viên nhóm
    /// </summary>
    /// <param name="groupId"></param>
    /// <param name="userId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<GroupUserCard?> GetMemberAsync(
        long groupId,
        Guid userId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy số lượng thành viên nhóm
    /// </summary>
    /// <param name="groupId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> GetMembersCountAsync(
        long groupId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách thành viên nhóm
    /// </summary>
    /// <param name="groupId"></param>
    /// <param name="sorting"></param>
    /// <param name="skipCount"></param>
    /// <param name="maxResultCount"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<GroupUserCard>> GetMembersAsync(
        long groupId,
        string? sorting = nameof(GroupUserCard.UserId),
        int skipCount = 0,
        int maxResultCount = 10,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy danh sách nhóm của thành viên
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<Group>> GetMemberGroupsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa thành viên khỏi nhóm
    /// </summary>
    /// <param name="groupId"></param>
    /// <param name="userId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RemoveMemberFormGroupAsync(
        long groupId,
        Guid userId,
        CancellationToken cancellationToken = default);
}
