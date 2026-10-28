using Volo.Abp.Authorization.Permissions;
using Volo.Abp.IdentityServer.Localization;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.IdentityServer;

public class AbpIdentityServerPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        // TODO: Máy chủ xác thực danh tính chỉ nên thuộc về máy chủ (host)
        // Thêm MultiTenancySides.Host
        // var identityServerGroup = context.AddGroup(AbpIdentityServerPermissions.GroupName, L("Permissions:IdentityServer"), MultiTenancySides.Host);

        // Kết hợp với mô-đun LINGYUN.Abp.FeatureManagement.Client, làm như vậy sẽ không phụ thuộc vào mức độ ưu tiên của mô-đun
        var identityServerGroup = context.GetGroupOrNull(AbpIdentityServerPermissions.GroupName);
        if (identityServerGroup == null)
        {
            identityServerGroup = context
                .AddGroup(
                    name: AbpIdentityServerPermissions.GroupName,
                    displayName: L("Permissions:IdentityServer"));
        }
        // Quyền máy khách
        var clientPermissions = identityServerGroup.AddPermission(AbpIdentityServerPermissions.Clients.Default, L("Permissions:Clients"), MultiTenancySides.Host);
        clientPermissions.AddChild(AbpIdentityServerPermissions.Clients.Create, L("Permissions:Create"), MultiTenancySides.Host);
        clientPermissions.AddChild(AbpIdentityServerPermissions.Clients.Update, L("Permissions:Update"), MultiTenancySides.Host);
        clientPermissions.AddChild(AbpIdentityServerPermissions.Clients.Clone, L("Permissions:Clone"), MultiTenancySides.Host);
        clientPermissions.AddChild(AbpIdentityServerPermissions.Clients.Delete, L("Permissions:Delete"), MultiTenancySides.Host);
        clientPermissions.AddChild(AbpIdentityServerPermissions.Clients.ManagePermissions, L("Permissions:ManagePermissions"), MultiTenancySides.Host);
        clientPermissions.AddChild(AbpIdentityServerPermissions.Clients.ManageClaims, L("Permissions:ManageClaims"), MultiTenancySides.Host);
        clientPermissions.AddChild(AbpIdentityServerPermissions.Clients.ManageSecrets, L("Permissions:ManageSecrets"), MultiTenancySides.Host);
        clientPermissions.AddChild(AbpIdentityServerPermissions.Clients.ManageProperties, L("Permissions:ManageProperties"), MultiTenancySides.Host);

        // Quyền tài nguyên Api
        var apiResourcePermissions = identityServerGroup.AddPermission(AbpIdentityServerPermissions.ApiResources.Default, L("Permissions:ApiResources"), MultiTenancySides.Host);
        apiResourcePermissions.AddChild(AbpIdentityServerPermissions.ApiResources.Create, L("Permissions:Create"), MultiTenancySides.Host);
        apiResourcePermissions.AddChild(AbpIdentityServerPermissions.ApiResources.Update, L("Permissions:Update"), MultiTenancySides.Host);
        apiResourcePermissions.AddChild(AbpIdentityServerPermissions.ApiResources.Delete, L("Permissions:Delete"), MultiTenancySides.Host);
        apiResourcePermissions.AddChild(AbpIdentityServerPermissions.ApiResources.ManageClaims, L("Permissions:ManageClaims"), MultiTenancySides.Host);
        apiResourcePermissions.AddChild(AbpIdentityServerPermissions.ApiResources.ManageSecrets, L("Permissions:ManageSecrets"), MultiTenancySides.Host);
        apiResourcePermissions.AddChild(AbpIdentityServerPermissions.ApiResources.ManageScopes, L("Permissions:ManageScopes"), MultiTenancySides.Host);
        apiResourcePermissions.AddChild(AbpIdentityServerPermissions.ApiResources.ManageProperties, L("Permissions:ManageProperties"), MultiTenancySides.Host);

        // Quyền phạm vi Api
        var apiScopePermissions = identityServerGroup.AddPermission(AbpIdentityServerPermissions.ApiScopes.Default, L("Permissions:ApiScopes"), MultiTenancySides.Host);
        apiScopePermissions.AddChild(AbpIdentityServerPermissions.ApiScopes.Create, L("Permissions:Create"), MultiTenancySides.Host);
        apiScopePermissions.AddChild(AbpIdentityServerPermissions.ApiScopes.Update, L("Permissions:Update"), MultiTenancySides.Host);
        apiScopePermissions.AddChild(AbpIdentityServerPermissions.ApiScopes.Delete, L("Permissions:Delete"), MultiTenancySides.Host);
        apiScopePermissions.AddChild(AbpIdentityServerPermissions.ApiScopes.ManageClaims, L("Permissions:ManageClaims"), MultiTenancySides.Host);
        apiScopePermissions.AddChild(AbpIdentityServerPermissions.ApiScopes.ManageProperties, L("Permissions:ManageProperties"), MultiTenancySides.Host);

        // Quyền tài nguyên danh tính
        var identityResourcePermissions = identityServerGroup.AddPermission(AbpIdentityServerPermissions.IdentityResources.Default, L("Permissions:IdentityResources"), MultiTenancySides.Host);
        identityResourcePermissions.AddChild(AbpIdentityServerPermissions.IdentityResources.Create, L("Permissions:Create"), MultiTenancySides.Host);
        identityResourcePermissions.AddChild(AbpIdentityServerPermissions.IdentityResources.Update, L("Permissions:Update"), MultiTenancySides.Host);
        identityResourcePermissions.AddChild(AbpIdentityServerPermissions.IdentityResources.Delete, L("Permissions:Delete"), MultiTenancySides.Host);
        identityResourcePermissions.AddChild(AbpIdentityServerPermissions.IdentityResources.ManageClaims, L("Permissions:ManageClaims"), MultiTenancySides.Host);
        identityResourcePermissions.AddChild(AbpIdentityServerPermissions.IdentityResources.ManageProperties, L("Permissions:ManageProperties"), MultiTenancySides.Host);

        // Ủy quyền bền vững
        var persistedGrantPermissions = identityServerGroup.AddPermission(AbpIdentityServerPermissions.Grants.Default, L("Permissions:Grants"), MultiTenancySides.Host);
        persistedGrantPermissions.AddChild(AbpIdentityServerPermissions.Grants.Delete, L("Permissions:Delete"), MultiTenancySides.Host);
    }

    protected virtual LocalizableString L(string name)
    {
        return LocalizableString.Create<AbpIdentityServerResource>(name);
    }
}
