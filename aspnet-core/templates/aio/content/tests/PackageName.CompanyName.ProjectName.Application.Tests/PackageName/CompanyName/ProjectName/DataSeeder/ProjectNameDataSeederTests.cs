using Microsoft.Extensions.DependencyInjection;
using PackageName.CompanyName.ProjectName.AIO.EntityFrameworkCore.DataSeeder;
using PackageName.CompanyName.ProjectName.Users;
using Shouldly;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Uow;
using Xunit;

namespace PackageName.CompanyName.ProjectName.DataSeeder
{
    /// <summary>
    /// Kiểm thử khởi tạo dữ liệu seed
    /// </summary>
    [Collection("Database")]
    public class ProjectNameDataSeederTests : ProjectNameApplicationTestBase
    {
        private readonly IProjectNameDataSeeder _inspectionDataSeeder;
        private readonly IRepository<User, Guid> _userRepository;
        private readonly IIdentityRoleRepository _identityRoleRepository;
        private readonly IIdentityUserRepository _identityUserRepository;

        public ProjectNameDataSeederTests()
        {
            _inspectionDataSeeder = GetRequiredService<IProjectNameDataSeeder>();
            _userRepository = GetRequiredService<IRepository<User, Guid>>();
            _identityRoleRepository = GetRequiredService<IIdentityRoleRepository>();
            _identityUserRepository = GetRequiredService<IIdentityUserRepository>();
        }

        [Fact]
        public async Task Should_Seed_Data_Successfully()
        {
            // Arrange
            var context = new DataSeedContext();

            // Act
            await _inspectionDataSeeder.SeedAsync(context);

            // Assert - Dùng phương thức unit of work để bọc mọi thao tác cơ sở dữ liệu
            await WithUnitOfWorkAsync(async () =>
            {
                // Kiểm thử vai trò
                var roles = await _identityRoleRepository.GetListAsync();
                roles.Count.ShouldBeGreaterThanOrEqualTo(7); // Ít nhất phải có 7 vai trò

                var superAdminRole = await _identityRoleRepository.FindByNormalizedNameAsync("Quản trị viên cấp cao".ToUpperInvariant());
                superAdminRole.ShouldNotBeNull();
                // Kiểm thử người dùng
                var users = await _userRepository.GetListAsync();
                users.Count.ShouldBeGreaterThanOrEqualTo(10); // Ít nhất phải có 10 người dùng

                foreach (var user in users)
                {
                    user.IdentityUserId.ShouldNotBe(Guid.Empty);

                    var identityUser = await _identityUserRepository.GetAsync(user.IdentityUserId);
                    identityUser.ShouldNotBeNull();
                }
                
                return true;
            });
        }

        [Theory]
        [InlineData("Quản trị viên cấp cao")]
        [InlineData("Người dùng thông thường")]
        public async Task Should_Create_Roles(string roleName)
        {
            // Arrange
            var context = new DataSeedContext();
            await _inspectionDataSeeder.SeedAsync(context);

            // Act & Assert - Dùng phương thức unit of work để bọc
            await WithUnitOfWorkAsync(async () =>
            {
                var role = await _identityRoleRepository.FindByNormalizedNameAsync(roleName.ToUpperInvariant());
                role.ShouldNotBeNull();
                role.Name.ShouldBe(roleName);
                
                return true;
            });
        }

        [Theory]
        [InlineData("testuser1")]
        [InlineData("testuser2")]
        public async Task Should_Create_Users(string nickName)
        {
            // Arrange
            var context = new DataSeedContext();
            await _inspectionDataSeeder.SeedAsync(context);

            // Act & Assert - Dùng phương thức unit of work để bọc
            await WithUnitOfWorkAsync(async () =>
            {
                var users = await _userRepository.GetListAsync();
                var user = users.FirstOrDefault(u => u.NickName == nickName);
                user.ShouldNotBeNull();
                user.NickName.ShouldBe(nickName);
                user.IdentityUserId.ShouldNotBe(Guid.Empty);

                var identityUser = await _identityUserRepository.GetAsync(user.IdentityUserId);
                identityUser.ShouldNotBeNull();
                identityUser.Name.ShouldBe(nickName);
                
                return true;
            });
        }
        
        // Thêm phương thức unit of work
        protected override Task<TResult> WithUnitOfWorkAsync<TResult>(Func<Task<TResult>> func)
        {
            return WithUnitOfWorkAsync(new AbpUnitOfWorkOptions(), func);
        }
        
        // Tùy chọn: thêm phương thức nạp chồng để hỗ trợ thêm trường hợp
        protected async override Task<TResult> WithUnitOfWorkAsync<TResult>(AbpUnitOfWorkOptions options, Func<Task<TResult>> func)
        {
            using (var scope = ServiceProvider.CreateScope())
            {
                var uowManager = scope.ServiceProvider.GetRequiredService<IUnitOfWorkManager>();

                using (var uow = uowManager.Begin(options))
                {
                    var result = await func();
                    await uow.CompleteAsync();
                    return result;
                }
            }
        }
    }
}
