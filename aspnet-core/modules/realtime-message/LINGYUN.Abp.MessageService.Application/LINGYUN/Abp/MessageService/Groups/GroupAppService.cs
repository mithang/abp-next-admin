using LINGYUN.Abp.IM.Groups;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.MessageService.Groups;

[AllowAnonymous]
public class GroupAppService : AbpMessageServiceApplicationServiceBase, IGroupAppService
{
    private readonly IGroupStore _groupStore;

    public GroupAppService(
        IGroupStore groupStore)
    {
        _groupStore = groupStore;
    }

    public async virtual Task<Group> GetAsync(string groupId)
    {
        // SEC-04: request ẩn danh chỉ thấy group cho phép trò chuyện ẩn danh
        // (cờ ChatGroup.AllowAnonymous); người dùng đã đăng nhập giữ nguyên hành vi.
        return await _groupStore.GetAsync(CurrentTenant.Id, groupId, allowAnonymousOnly: CurrentUser.Id == null);
    }

    public async virtual Task<PagedResultDto<Group>> SearchAsync(GroupSearchInput input)
    {
        // SEC-04: như trên — lọc ngay ở tầng truy vấn để count/phân trang khớp nhau.
        var anonymousOnly = CurrentUser.Id == null;

        var count = await _groupStore.GetCountAsync(
            CurrentTenant.Id,
            input.Filter,
            anonymousOnly);

        var groups = await _groupStore.GetListAsync(
            CurrentTenant.Id,
            input.Filter,
            input.Sorting,
            input.SkipCount,
            input.MaxResultCount,
            anonymousOnly);

        return new PagedResultDto<Group>(count, groups);
    }
}
