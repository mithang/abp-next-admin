using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace LINGYUN.Abp.SystemInfo.Permissions;

public class SystemInfoPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var systemInfoGroup = context.AddGroup(
            SystemInfoPermissions.GroupName,
            new FixedLocalizableString("Chi tiết hệ thống"));

        systemInfoGroup.AddPermission(
            SystemInfoPermissions.Default,
            new FixedLocalizableString("Lấy chi tiết hệ thống"),
            Volo.Abp.MultiTenancy.MultiTenancySides.Host)
            .WithProviders(ClientPermissionValueProvider.ProviderName); // Sử dụng cấp quyền phía client
    }
}
