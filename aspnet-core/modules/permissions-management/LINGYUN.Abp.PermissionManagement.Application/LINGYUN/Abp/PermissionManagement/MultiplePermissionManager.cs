using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Caching;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SimpleStateChecking;


namespace LINGYUN.Abp.PermissionManagement;

[Dependency(ReplaceServices = true)]
[ExposeServices(
    typeof(IMultiplePermissionManager),
    typeof(PermissionManager),
    typeof(MultiplePermissionManager))]
public class MultiplePermissionManager : PermissionManager, IMultiplePermissionManager, ISingletonDependency
{
    public MultiplePermissionManager(
        IPermissionDefinitionManager permissionDefinitionManager,
        ISimpleStateCheckerManager<PermissionDefinition> simpleStateCheckerManager,
        IPermissionGrantRepository permissionGrantRepository,
        IServiceProvider serviceProvider,
        IGuidGenerator guidGenerator, 
        IOptions<PermissionManagementOptions> options,
        ICurrentTenant currentTenant,
        IDistributedCache<PermissionGrantCacheItem> cache) 
        : base(
            permissionDefinitionManager, 
            simpleStateCheckerManager, 
            permissionGrantRepository, 
            serviceProvider, 
            guidGenerator, 
            options, 
            currentTenant, 
            cache)
    {
    }

    public async virtual Task SetManyAsync(string providerName, string providerKey, IEnumerable<PermissionChangeState> permissions)
    {
        // Tất cả định nghĩa quyền
        var permissionDefinitions = await PermissionDefinitionManager.GetPermissionsAsync();

        // Tập hợp các quyền tồn tại
        var existsPermissions = permissions
            .Join(
                permissionDefinitions,
                p => p.Name,
                pd => pd.Name,
                (p, pd) =>
                {
                    return new
                    {
                        State = p,
                        Definition = pd
                    };
                });

        // Kiểm tra trạng thái quyền
        var existsPermissionDefinitions = existsPermissions.Select(p => p.Definition).ToArray();
        var stateCheckResult = await SimpleStateCheckerManager.IsEnabledAsync(existsPermissionDefinitions);
        var invalidCheckPermissions = stateCheckResult.Where(x => !x.Value).Select(x => x.Key.Name);
        if (invalidCheckPermissions.Any())
        {
            throw new ApplicationException($"The permission named '{invalidCheckPermissions.JoinAsString(";")}' is disabled!");
        }

        // Kiểm tra phạm vi nhà cung cấp quyền
        var invalidProviderPermissions = existsPermissions.Where(x => x.Definition.Providers.Any() && !x.Definition.Providers.Contains(providerName)).Select(x => x.Definition.Name);
        if (invalidProviderPermissions.Any())
        {
            throw new ApplicationException($"The permission named '{invalidProviderPermissions.JoinAsString(";")}' has not compatible with the provider named '{providerName}'");
        }
        // Kiểm tra phạm vi đa tenant của quyền
        var multiTenancySide = CurrentTenant.GetMultiTenancySide();
        var invalidMultiTenancySidePermissions = existsPermissions.Where(x => !x.Definition.MultiTenancySide.HasFlag(multiTenancySide)).Select(x => x.Definition.Name);
        if (invalidMultiTenancySidePermissions.Any())
        {
            throw new ApplicationException($"The permission named '{invalidMultiTenancySidePermissions.JoinAsString(";")}' has multitenancy side which is not compatible with the current multitenancy side '{multiTenancySide}'");
        }

        // Lấy nhà cung cấp quyền
        var provider = ManagementProviders.FirstOrDefault(m => m.Name == providerName) ?? 
            throw new AbpException("Unknown permission management provider: " + providerName);

        // Lấy toàn bộ quyền đã cấp hiện có
        var permissionGrants = await PermissionGrantRepository.GetListAsync(providerName, providerKey);
        var permissionGrantNames = permissionGrants.Select(x => x.Name);

        // Xóa các quyền bị hủy cấp
        var delPermissionGrantNames = existsPermissions.Where(x => !x.State.IsGranted).Select(x => x.State.Name);
        var delPermissionGrants = permissionGrants.Where(x => delPermissionGrantNames.Contains(x.Name));
        await PermissionGrantRepository.DeleteManyAsync(delPermissionGrants);

        // Thêm quyền cấp mới
        var newPermissionGrants = existsPermissions
            .Where(x => x.State.IsGranted && !permissionGrantNames.Contains(x.State.Name))
            .Select(p => new PermissionGrant(
                GuidGenerator.Create(),
                p.Definition.Name,
                provider.Name,
                providerKey,
                CurrentTenant.Id));
        await PermissionGrantRepository.InsertManyAsync(newPermissionGrants);
    }
}
