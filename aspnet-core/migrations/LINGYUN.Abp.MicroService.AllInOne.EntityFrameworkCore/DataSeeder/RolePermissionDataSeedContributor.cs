using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;

namespace LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.DataSeeder;

public class RolePermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    public ILogger<RolePermissionDataSeedContributor> Logger { protected get; set; }

    protected ICurrentTenant CurrentTenant { get; }
    protected IPermissionDataSeeder PermissionDataSeeder { get; }
    protected IPermissionDefinitionManager PermissionDefinitionManager { get; }

    public RolePermissionDataSeedContributor(
        ICurrentTenant currentTenant, 
        IPermissionDataSeeder permissionDataSeeder, 
        IPermissionDefinitionManager permissionDefinitionManager)
    {
        CurrentTenant = currentTenant;
        PermissionDataSeeder = permissionDataSeeder;
        PermissionDefinitionManager = permissionDefinitionManager;

        Logger = NullLogger<RolePermissionDataSeedContributor>.Instance;
    }

    public async virtual Task SeedAsync(DataSeedContext context)
    {
        using (CurrentTenant.Change(context.TenantId))
        {
            Logger.LogInformation("Seeding the Users role permissions...");

            // Tất cả người dùng đều nên có quyền tra cứu người dùng, dùng cho kịch bản IM.
            // LƯU Ý (SEC-12, vòng security 6): KHÔNG seed IdentityPermissions.Users.Default
            // ở đây nữa. Quyền đó cho phép liệt kê toàn bộ user và đọc record của bất kỳ
            // user nào (kể cả admin, kèm email); kịch bản IM chỉ cần UserLookup. Seed
            // Users.Default tại đây từng khiến mọi lần thu hồi quyền qua API đều bị cấp
            // lại ở lần khởi động backend tiếp theo, nên thu hồi qua API không bao giờ bền.
            await PermissionDataSeeder.SeedAsync(
                RolePermissionValueProvider.ProviderName,
                "Users",
                new string[]
                {
                    IdentityPermissions.UserLookup.Default,
                    "Platform.Feedback.Create"
                },
                tenantId: context.TenantId);

            Logger.LogInformation("Seeding Users role permissions completed.");
        }
    }
}
