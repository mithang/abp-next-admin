using LINGYUN.Abp.IM.Groups;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;
using Volo.Abp.ObjectMapping;

namespace LINGYUN.Abp.MessageService.Groups;

public class GroupStore : IGroupStore, ITransientDependency
{
    private readonly ICurrentTenant _currentTenant;
    private readonly IGroupRepository _groupRepository;
    private readonly IObjectMapper<AbpMessageServiceDomainModule> _objectMapper;

    public GroupStore(
        ICurrentTenant currentTenant,
        IGroupRepository groupRepository,
        IObjectMapper<AbpMessageServiceDomainModule> objectMapper)
    {
        _objectMapper = objectMapper;
        _currentTenant = currentTenant;
        _groupRepository = groupRepository;
    }

    public async virtual Task<Group> GetAsync(
        Guid? tenantId,
        string groupId,
        bool allowAnonymousOnly = false,
        CancellationToken cancellationToken = default)
    {
        using (_currentTenant.Change(tenantId))
        {
            var group = await _groupRepository.GetByIdAsync(long.Parse(groupId), cancellationToken);
            var result = _objectMapper.Map<ChatGroup, Group>(group);
            // SEC-04: request ẩn danh chỉ được thấy group cho phép trò chuyện ẩn danh.
            // Trả cùng lỗi "không tìm thấy" để không lộ sự tồn tại của group không public.
            if (allowAnonymousOnly && !result.AllowAnonymous)
            {
                throw new BusinessException(MessageServiceErrorCodes.GroupNotFount);
            }
            return result;
        }
    }

    public async virtual Task<int> GetCountAsync(
        Guid? tenantId,
        string? filter = null,
        bool allowAnonymousOnly = false,
        CancellationToken cancellationToken = default)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await _groupRepository.GetCountAsync(filter, allowAnonymousOnly, cancellationToken);
        }
    }

    public async virtual Task<List<Group>> GetListAsync(
        Guid? tenantId,
        string? filter = null,
        string? sorting = nameof(Group.Name),
        int skipCount = 0,
        int maxResultCount = 10,
        bool allowAnonymousOnly = false,
        CancellationToken cancellationToken = default)
    {
        using (_currentTenant.Change(tenantId))
        {
            var groups = await _groupRepository.GetListAsync(
                filter,
                sorting,
                skipCount,
                maxResultCount,
                allowAnonymousOnly,
                cancellationToken);

            return _objectMapper.Map<List<ChatGroup>, List<Group>>(groups);
        }
    }
}
