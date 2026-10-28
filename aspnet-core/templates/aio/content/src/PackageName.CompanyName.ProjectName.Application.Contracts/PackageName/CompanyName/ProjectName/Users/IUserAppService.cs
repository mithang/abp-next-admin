using PackageName.CompanyName.ProjectName.Users.Dtos;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace PackageName.CompanyName.ProjectName.Users
{
    /// <summary>
    /// Giao diện service ứng dụng người dùng
    /// </summary>
    public interface IUserAppService : 
        IApplicationService
    {
        /// <summary>
        /// Tạo người dùng
        /// </summary>
        Task<UserDto> CreateAsync(CreateUpdateUserDto input);

        /// <summary>
        /// Cập nhật người dùng
        /// </summary>
        Task<UserDto> UpdateAsync(Guid id, CreateUpdateUserDto input);

        /// <summary>
        /// Xóa người dùng
        /// </summary>
        Task DeleteAsync(Guid id);

        /// <summary>
        /// Lấy người dùng
        /// </summary>
        Task<UserDto> GetAsync(Guid id);

        /// <summary>
        /// Lấy danh sách người dùng
        /// </summary>
        Task<PagedResultDto<UserItemDto>> GetListAsync(UserPagedAndSortedResultRequestDto input);

        /// <summary>
        /// Đổi mật khẩu người dùng
        /// </summary>
        Task ChangePasswordAsync(Guid id, string currentPassword, string newPassword);

        /// <summary>
        /// Đặt lại mật khẩu người dùng (thao tác của quản trị viên)
        /// </summary>
        Task ResetPasswordAsync(Guid id, string newPassword);

        /// <summary>
        /// Bật hoặc tắt người dùng
        /// </summary>
        Task SetUserActiveStatusAsync(Guid id, bool isActive);
    }
}