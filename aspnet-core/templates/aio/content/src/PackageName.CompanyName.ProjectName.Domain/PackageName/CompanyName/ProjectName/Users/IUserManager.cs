using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Services;

namespace PackageName.CompanyName.ProjectName.Users
{
    /// <summary>
    /// Giao diện service quản lý người dùng
    /// </summary>
    public interface IUserManager : IDomainService
    {
        /// <summary>
        /// Tạo người dùng mới
        /// </summary>
        Task<User> CreateAsync(
            string nickName,
            string password,
            string contactInfo = null,
            string position = null,
            bool isActive = true
            );

        /// <summary>
        /// Cập nhật thông tin người dùng
        /// </summary>
        Task<User> UpdateAsync(
            Guid id,
            string nickName,
            string password,
            string contactInfo = null,
            string position = null,
            bool isActive = true);

        /// <summary>
        /// Xóa người dùng
        /// </summary>
        Task DeleteAsync(Guid id);

        /// <summary>
        /// Đổi mật khẩu người dùng
        /// </summary>
        Task ChangePasswordAsync(Guid id, string currentPassword, string newPassword);

        /// <summary>
        /// Đặt lại mật khẩu người dùng
        /// </summary>
        Task ResetPasswordAsync(Guid id, string newPassword);

        /// <summary>
        /// Lấy thông tin người dùng
        /// </summary>
        Task<User> GetAsync(Guid id);

        /// <summary>
        /// Lấy người dùng theo ID người dùng Identity
        /// </summary>
        Task<User> FindByIdentityUserIdAsync(Guid identityUserId);

        /// <summary>
        /// Tìm người dùng theo biệt danh người dùng
        /// </summary>
        Task<User> FindByNickNameAsync(string nickName);

        /// <summary>
        /// Tắt hoặc bật người dùng
        /// </summary>
        Task SetUserActiveStatusAsync(Guid id, bool isActive);
    }
}