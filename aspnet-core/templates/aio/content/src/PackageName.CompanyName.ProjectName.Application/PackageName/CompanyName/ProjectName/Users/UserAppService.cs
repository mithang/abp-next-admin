using Microsoft.AspNetCore.Authorization;
using PackageName.CompanyName.ProjectName.Permissions;
using PackageName.CompanyName.ProjectName.Users.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Identity;

namespace PackageName.CompanyName.ProjectName.Users
{
    /// <summary>
    /// Người dùng
    /// </summary>
    public class UserAppService : ApplicationService, IUserAppService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserManager _userManager;
        private readonly IdentityUserManager _identityUserManager;

        public UserAppService(
            IUserRepository userRepository,
            IUserManager userManager,
            IdentityUserManager identityUserManager)
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _identityUserManager = identityUserManager;
        }

        /// <summary>
        /// Tạo người dùng
        /// </summary>
        [Authorize(ProjectNamePermissions.User.Create)]
        public async Task<UserDto> CreateAsync(CreateUpdateUserDto input)
        {
            // Logic kiểm tra và xác thực tham số có thể được thêm tại đây
            if (string.IsNullOrEmpty(input.NickName))
            {
                throw new UserFriendlyException("Biệt danh không được để trống");
            }
            if (string.IsNullOrEmpty(input.Password))
            {
                throw new UserFriendlyException("Mật khẩu không được để trống");
            }

            // Sử dụng UserManager để tạo người dùng
            var user = await _userManager.CreateAsync(
                input.NickName,
                input.Password,
                input.ContactInfo,
                input.Position,
                input.IsActive);

            // Trả về đối tượng DTO
            return await MapToUserDtoAsync(user);
        }

        /// <summary>
        /// Cập nhật người dùng
        /// </summary>
        [Authorize(ProjectNamePermissions.User.Update)]
        public async Task<UserDto> UpdateAsync(Guid id, CreateUpdateUserDto input)
        {
            // Sử dụng UserManager để cập nhật thông tin cơ bản của người dùng
            var user = await _userManager.UpdateAsync(
                id,
                input.NickName,
                input.Password,
                input.ContactInfo,
                input.Position,
                input.IsActive);

            // Đảm bảo trạng thái người dùng sau khi cập nhật nhất quán với trạng thái trong DTO
            if (user.IdentityUser != null)
            {
                bool currentIsActive = user.IdentityUser.LockoutEnd == null || user.IdentityUser.LockoutEnd < DateTimeOffset.Now;
                if (currentIsActive != input.IsActive)
                {
                    await _userManager.SetUserActiveStatusAsync(id, input.IsActive);
                    user = await _userManager.GetAsync(id);
                }
            }

            // Trả về đối tượng DTO
            return await MapToUserDtoAsync(user);
        }

        /// <summary>
        /// Xóa người dùng
        /// </summary>
        [Authorize(ProjectNamePermissions.User.Delete)]
        public Task DeleteAsync(Guid id)
        {
            return _userManager.DeleteAsync(id);
        }

        /// <summary>
        /// Lấy người dùng
        /// </summary>
        [Authorize(ProjectNamePermissions.User.Default)]
        public async Task<UserDto> GetAsync(Guid id)
        {
            var user = await _userManager.GetAsync(id);
            return await MapToUserDtoAsync(user);
        }

        /// <summary>
        /// Lấy danh sách người dùng
        /// </summary>
        [Authorize(ProjectNamePermissions.User.Default)]
        public async Task<PagedResultDto<UserItemDto>> GetListAsync(UserPagedAndSortedResultRequestDto input)
        {
            // Tạo truy vấn
            var query = await CreateFilteredQueryAsync(input);

            // Lấy tổng số bản ghi
            var totalCount = await AsyncExecuter.CountAsync(query);

            // Lấy kết quả truy vấn đã sắp xếp và phân trang
            var users = await AsyncExecuter.ToListAsync(
                query.OrderBy(input.Sorting ?? nameof(User.NickName))
                    .Skip(input.SkipCount)
                    .Take(input.MaxResultCount));

            // Chuyển đổi sang DTO và trả về
            var userDtos = new List<UserItemDto>();
            foreach (var user in users)
            {
                var userDto = ObjectMapper.Map<User, UserItemDto>(user);

                // Điền thông tin vai trò
                if (user.IdentityUser != null)
                {
                    var roles = await _identityUserManager.GetRolesAsync(user.IdentityUser);
                    userDto.RoleNames = string.Join("、", roles);
                    userDto.IsActive = user.IdentityUser.LockoutEnd == null || user.IdentityUser.LockoutEnd < DateTimeOffset.Now;
                }

                userDtos.Add(userDto);
            }

            return new PagedResultDto<UserItemDto>(totalCount, userDtos);
        }

        /// <summary>
        /// Đổi mật khẩu người dùng
        /// </summary>
        [Authorize]
        public async Task ChangePasswordAsync(Guid id, string currentPassword, string newPassword)
        {
            await _userManager.ChangePasswordAsync(id, currentPassword, newPassword);
        }

        /// <summary>
        /// Đặt lại mật khẩu người dùng (thao tác của quản trị viên)
        /// </summary>
        [Authorize(ProjectNamePermissions.User.Update)]
        public async Task ResetPasswordAsync(Guid id, string newPassword)
        {
            await _userManager.ResetPasswordAsync(id, newPassword);
        }

        /// <summary>
        /// Bật hoặc tắt người dùng
        /// </summary>
        [Authorize(ProjectNamePermissions.User.Update)]
        public async Task SetUserActiveStatusAsync(Guid id, bool isActive)
        {
            await _userManager.SetUserActiveStatusAsync(id, isActive);
        }

        /// <summary>
        /// Tạo truy vấn cơ sở, áp dụng điều kiện lọc
        /// </summary>
        protected async virtual Task<IQueryable<User>> CreateFilteredQueryAsync(
            UserPagedAndSortedResultRequestDto input)
        {
            // Lấy truy vấn cơ sở và tải các thực thể liên quan
            var query = await _userRepository.WithDetailsAsync(
                x => x.IdentityUser);

            // Áp dụng điều kiện lọc
            return query
                .WhereIf(!string.IsNullOrWhiteSpace(input.NickName),
                    x => x.NickName.Contains(input.NickName));
        }

        /// <summary>
        /// Ánh xạ thực thể User thành UserDto và điền thông tin quyền
        /// </summary>
        private async Task<UserDto> MapToUserDtoAsync(User user)
        {
            var userDto = ObjectMapper.Map<User, UserDto>(user);

            // Thiết lập trạng thái người dùng và thông tin vai trò
            if (user.IdentityUser != null)
            {
                var roles = await _identityUserManager.GetRolesAsync(user.IdentityUser);
                userDto.RoleNames = string.Join("、", roles);
                userDto.IsActive = user.IdentityUser.LockoutEnd == null || user.IdentityUser.LockoutEnd < DateTimeOffset.Now;
            }

            return userDto;
        }
    }
}