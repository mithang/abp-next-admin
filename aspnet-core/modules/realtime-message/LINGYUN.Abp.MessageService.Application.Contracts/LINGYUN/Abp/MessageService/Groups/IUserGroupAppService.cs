using LINGYUN.Abp.IM.Groups;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.MessageService.Groups;

public interface IUserGroupAppService : IApplicationService
{
    /// <summary>
    /// Yêu cầu tham gia nhóm
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task ApplyJoinGroupAsync(UserJoinGroupDto input);
    /// <summary>
    /// Lấy nhóm của tôi
    /// </summary>
    /// <returns></returns>
    Task<ListResultDto<Group>> GetMyGroupsAsync();
    /// <summary>
    /// Lấy người dùng trong nhóm
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<PagedResultDto<GroupUserCard>> GetGroupUsersAsync(GroupUserGetByPagedDto input);
    /// <summary>
    /// Xử lý yêu cầu tham gia nhóm của người dùng
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task GroupAcceptUserAsync(GroupAcceptUserDto input);
    /// <summary>
    /// Nhóm loại bỏ người dùng
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task GroupRemoveUserAsync(GroupRemoveUserDto input);
}
