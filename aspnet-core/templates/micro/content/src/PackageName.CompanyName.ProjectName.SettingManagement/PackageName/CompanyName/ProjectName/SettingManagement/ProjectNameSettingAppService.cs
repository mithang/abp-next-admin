using LINGYUN.Abp.SettingManagement;
using Microsoft.AspNetCore.Authorization;
using PackageName.CompanyName.ProjectName.Localization;
using PackageName.CompanyName.ProjectName.Permissions;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SettingManagement;
using Volo.Abp.Settings;
using Volo.Abp.Users;

namespace PackageName.CompanyName.ProjectName.SettingManagement;

public class ProjectNameSettingAppService : ApplicationService, IProjectNameSettingAppService
{
    protected ISettingManager SettingManager { get; }
    protected ISettingDefinitionManager SettingDefinitionManager { get; }

    public ProjectNameSettingAppService(
        ISettingManager settingManager,
        ISettingDefinitionManager settingDefinitionManager)
    {
        SettingManager = settingManager;
        SettingDefinitionManager = settingDefinitionManager;
        LocalizationResource = typeof(ProjectNameResource);
    }

    public virtual async Task<SettingGroupResult> GetAllForCurrentTenantAsync()
    {
        return await GetAllForProviderAsync(TenantSettingValueProvider.ProviderName, CurrentTenant.GetId().ToString());
    }

    [Authorize]
    public virtual async Task<SettingGroupResult> GetAllForCurrentUserAsync()
    {
        return await GetAllForProviderAsync(UserSettingValueProvider.ProviderName, CurrentUser.GetId().ToString());
    }

    public virtual async Task<SettingGroupResult> GetAllForGlobalAsync()
    {
        return await GetAllForProviderAsync(GlobalSettingValueProvider.ProviderName, null);
    }

    [Authorize(ProjectNamePermissions.ManageSettings)]
    public virtual async Task SetCurrentTenantAsync(UpdateSettingsDto input)
    {
        // Thêm kiểm tra tính năng
        await CheckFeatureAsync();

        if (CurrentTenant.IsAvailable)
        {
            foreach (var setting in input.Settings)
            {
                await SettingManager.SetForTenantAsync(CurrentTenant.GetId(), setting.Name, setting.Value);
            }
        }
    }

    [Authorize]
    public virtual async Task SetCurrentUserAsync(UpdateSettingsDto input)
    {
        // Thêm kiểm tra tính năng
        await CheckFeatureAsync();

        foreach (var setting in input.Settings)
        {
            await SettingManager.SetForCurrentUserAsync(setting.Name, setting.Value);
        }
    }

    [Authorize(ProjectNamePermissions.ManageSettings)]
    public virtual async Task SetGlobalAsync(UpdateSettingsDto input)
    {
        // Thêm kiểm tra tính năng
        await CheckFeatureAsync();

        foreach (var setting in input.Settings)
        {
            await SettingManager.SetGlobalAsync(setting.Name, setting.Value);
        }
    }


    protected virtual async Task CheckFeatureAsync()
    {
        await FeatureChecker.CheckEnabledAsync(SettingManagementFeatures.Enable);
    }

    protected virtual async Task<SettingGroupResult> GetAllForProviderAsync(string providerName, string? providerKey = null)
    {
        var settingGroups = new SettingGroupResult();

        //TODO: Tất cả các mục cấu hình của dự án hiện tại được định nghĩa và trả về tại đây

        await Task.CompletedTask;

        return settingGroups;
    }
}
