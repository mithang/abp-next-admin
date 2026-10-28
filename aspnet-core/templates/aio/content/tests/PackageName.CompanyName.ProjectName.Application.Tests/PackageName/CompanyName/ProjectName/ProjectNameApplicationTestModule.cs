using Hangfire;
using Hangfire.MemoryStorage;
using LINGYUN.Abp.Identity;
using LINGYUN.Abp.Identity.Session;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using PackageName.CompanyName.ProjectName.AIO.EntityFrameworkCore.DataSeeder;
using PackageName.CompanyName.ProjectName.EntityFrameworkCore;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement.Identity;
using Volo.Abp.Security.Claims;

namespace PackageName.CompanyName.ProjectName;

[DependsOn(
    typeof(ProjectNameDomainTestModule),
    typeof(ProjectNameApplicationModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpPermissionManagementDomainIdentityModule),
    typeof(ProjectNameEntityFrameworkCoreTestModule)
    )]
public class ProjectNameApplicationTestModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // //Đặt ILogger thành NullLogger
        context.Services.AddLogging(builder => builder.AddProvider(NullLoggerProvider.Instance));
        context.Services.AddTransient<IProjectNameDataSeeder, ProjectNameDataSeeder>();
        context.Services.AddLogging(builder => builder.AddProvider(NullLoggerProvider.Instance));
        context.Services.AddTransient<IHostEnvironment, TestHostEnvironment>();
        context.Services.AddTransient<IFileProvider, TestFileProvider>();
        
        // Thêm định nghĩa file cấu hình, cần khi tạo tenant mới
        Configure<IdentityOptions>(options =>
        {
            // Cho phép tên người dùng tiếng Trung
            options.User.AllowedUserNameCharacters = null;
            // Hỗ trợ mật khẩu yếu
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 1;
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            // Thêm cấu hình nhà cung cấp token hai yếu tố mặc định
            options.Tokens.ProviderMap.Add("Default", new TokenProviderDescriptor(typeof(EmailTokenProvider<IdentityUser>)));
        });
        Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
        Configure<IdentitySessionCleanupOptions>(options =>
        {
            options.IsCleanupEnabled = true;
        });
        // Cấu hình Hangfire
        context.Services.AddHangfire(config =>
        {
            config.UseMemoryStorage();
        });
    }
}
