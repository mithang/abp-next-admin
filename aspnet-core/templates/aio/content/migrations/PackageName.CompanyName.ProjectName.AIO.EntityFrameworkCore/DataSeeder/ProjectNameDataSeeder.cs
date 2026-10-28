using Microsoft.Extensions.Logging;
using PackageName.CompanyName.ProjectName.Users;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using IdentityRole = Volo.Abp.Identity.IdentityRole;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace PackageName.CompanyName.ProjectName.AIO.EntityFrameworkCore.DataSeeder
{
    public class ProjectNameDataSeeder : IProjectNameDataSeeder, ITransientDependency
    {
        private readonly ICurrentTenant _currentTenant;
        private readonly IGuidGenerator _guidGenerator;
        private readonly ILogger<ProjectNameDataSeeder> _logger;
        private readonly IRepository<User, Guid> _userRepository;
        private readonly IdentityUserManager _identityUserManager;
        private readonly IdentityRoleManager _identityRoleManager;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        /// <summary>
        /// Hàm khởi tạo
        /// </summary>
        public ProjectNameDataSeeder(
            ICurrentTenant currentTenant,
            IGuidGenerator guidGenerator,
            ILogger<ProjectNameDataSeeder> logger,
            IRepository<User, Guid> userRepository,
            IdentityUserManager identityUserManager,
            IdentityRoleManager identityRoleManager,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _currentTenant = currentTenant;
            _guidGenerator = guidGenerator;
            _logger = logger;
            _userRepository = userRepository;
            _identityUserManager = identityUserManager;
            _identityRoleManager = identityRoleManager;
            _unitOfWorkManager = unitOfWorkManager;
        }

        /// <summary>
        /// Khởi tạo dữ liệu
        /// </summary>
        /// <param name="context">Ngữ cảnh seed dữ liệu</param>
        /// <returns>Tác vụ</returns>
        public async Task SeedAsync(DataSeedContext context)
        {
            using (_currentTenant.Change(context.TenantId))
            {
                _logger.LogInformation("Bắt đầu khởi tạo dữ liệu...");

                // Khởi tạo vai trò
                using (var uow = _unitOfWorkManager.Begin(requiresNew: true))
                {
                    await SeedRolesAsync();
                    await uow.CompleteAsync();
                }

                // Khởi tạo dữ liệu người dùng
                using (var uow = _unitOfWorkManager.Begin(requiresNew: true))
                {
                    await SeedUsersAsync();
                    await uow.CompleteAsync();
                }

                _logger.LogInformation("Khởi tạo dữ liệu hoàn tất");
            }
        }

        /// <summary>
        /// Khởi tạo dữ liệu vai trò
        /// </summary>
        private async Task SeedRolesAsync()
        {
            // Quản trị viên cấp cao
            await CreateRoleIfNotExistsAsync(
                "Quản trị viên cấp cao",
                "Quản trị viên cấp cao của hệ thống, có mọi quyền");
        }

        /// <summary>
        /// Tạo vai trò (nếu chưa tồn tại)
        /// </summary>
        private async Task CreateRoleIfNotExistsAsync(string roleName, string description)
        {
            if (await _identityRoleManager.FindByNameAsync(roleName) == null)
            {
                var role = new IdentityRole(
                    _guidGenerator.Create(),
                    roleName,
                    _currentTenant.Id)
                {
                    IsStatic = true,
                    IsPublic = true
                };

                await _identityRoleManager.CreateAsync(role);

                _logger.LogInformation($"Đã tạo vai trò: {roleName}");
            }
        }

        /// <summary>
        /// Khởi tạo dữ liệu người dùng
        /// </summary>
        private async Task SeedUsersAsync()
        {

            // Tìm vai trò Quản trị viên cấp cao
            var superAdminRole = await _identityRoleManager.FindByNameAsync("Quản trị viên cấp cao");
            if (superAdminRole == null)
            {
                _logger.LogError("Không tìm thấy vai trò Quản trị viên cấp cao, không thể gán vai trò cho người dùng");
                return;
            }

            // Tạo dữ liệu người dùng (dùng tên người dùng cố định để tránh lỗi phát sinh)
            await CreateUserIfNotExistsAsync("user1", "user1", "Quản trị viên cấp cao");
            await CreateUserIfNotExistsAsync("user2", "user2", "Quản trị viên cấp cao");
            await CreateUserIfNotExistsAsync("user3", "user3",  "Quản trị viên cấp cao");
            await CreateUserIfNotExistsAsync("user4", "user4", "Quản trị viên cấp cao");
        }

        /// <summary>
        /// Tạo người dùng (nếu chưa tồn tại)
        /// </summary>
        private async Task CreateUserIfNotExistsAsync(
            string name,
            string userName,
            string roles)
        {
            // Kiểm tra người dùng đã tồn tại hay chưa
            var existingUser = await _userRepository.FindAsync(u => u.NickName == name);
            if (existingUser != null)
            {
                _logger.LogInformation($"Người dùng [{name}] đã tồn tại, bỏ qua việc tạo");
                return;
            }

            var identityUser = await _identityUserManager.FindByNameAsync(userName);
            if (identityUser == null)
            {
                // Tạo người dùng Identity
                identityUser = new IdentityUser(
                    _guidGenerator.Create(),
                    userName,
                    $"{userName}@example.com",
                    _currentTenant.Id)
                {
                    Name = name,
                    Surname = ""
                };

                // Đặt mật khẩu mặc định 123456
                var identityResult = await _identityUserManager.CreateAsync(identityUser, "123456");
                if (!identityResult.Succeeded)
                {
                    _logger.LogError($"Tạo người dùng Identity [{name}] thất bại: {string.Join(", ", identityResult.Errors.Select(e => e.Description))}");
                    return;
                }

                // Gán vai trò
                if (!string.IsNullOrWhiteSpace(roles))
                {
                    var roleNames = roles.Split(',', StringSplitOptions.RemoveEmptyEntries);
                    foreach (var roleName in roleNames)
                    {
                        var trimmedRoleName = roleName.Trim();
                        var role = await _identityRoleManager.FindByNameAsync(trimmedRoleName);
                        if (role != null)
                        {
                            var roleResult = await _identityUserManager.AddToRoleAsync(identityUser, trimmedRoleName);
                            if (!roleResult.Succeeded)
                            {
                                _logger.LogWarning($"Gán vai trò [{trimmedRoleName}] cho người dùng [{name}] thất bại: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
                            }
                        }
                        else
                        {
                            _logger.LogWarning($"Vai trò [{trimmedRoleName}] không tồn tại, không thể gán cho người dùng [{name}]");
                        }
                    }
                }

                // Tạo người dùng hệ thống
                var user = new User(
                    _guidGenerator.Create(),
                    name,
                    identityUser.Id);

                // Lưu người dùng
                await _userRepository.InsertAsync(user);

                _logger.LogInformation($"Đã tạo người dùng: {name}, tên người dùng: {userName}");
            }
            else
            {
                _logger.LogInformation($"Người dùng Identity [{userName}] đã tồn tại, kiểm tra xem có cần tạo người dùng nghiệp vụ không");

                // Kiểm tra xem có cần tạo người dùng nghiệp vụ không
                var businessUser = await _userRepository.FindAsync(u => u.IdentityUserId == identityUser.Id);
                if (businessUser == null)
                {
                    // Tạo người dùng hệ thống
                    var user = new User(
                        _guidGenerator.Create(),
                        name,
                        identityUser.Id);

                    // Lưu người dùng
                    await _userRepository.InsertAsync(user);

                    _logger.LogInformation($"Đã tạo người dùng nghiệp vụ cho người dùng Identity đã tồn tại: {name}");
                }
            }
        }
    }
}
