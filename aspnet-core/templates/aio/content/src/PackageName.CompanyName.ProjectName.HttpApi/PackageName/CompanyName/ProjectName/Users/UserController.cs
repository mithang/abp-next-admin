using Microsoft.AspNetCore.Mvc;
using PackageName.CompanyName.ProjectName.Users.Dtos;
using System;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

namespace PackageName.CompanyName.ProjectName.Users
{
    /// <summary>
    /// Controller quản lý người dùng
    /// </summary>
    [RemoteService]
    [Route("api/app/user")]
    public class UserController : ProjectNameControllerBase
    {
        private readonly IUserAppService _userAppService;

        public UserController(IUserAppService userAppService)
        {
            _userAppService = userAppService;
        }

        /// <summary>
        /// Tạo người dùng
        /// </summary>
        [HttpPost]
        public async Task<UserDto> CreateAsync(CreateUpdateUserDto input)
        {
            return await _userAppService.CreateAsync(input);
        }

        /// <summary>
        /// Cập nhật người dùng
        /// </summary>
        [HttpPut("{id}")]
        public async Task<UserDto> UpdateAsync(Guid id, CreateUpdateUserDto input)
        {
            return await _userAppService.UpdateAsync(id, input);
        }

        /// <summary>
        /// Xóa người dùng
        /// </summary>
        [HttpDelete("{id}")]
        public async Task DeleteAsync(Guid id)
        {
            await _userAppService.DeleteAsync(id);
        }

        /// <summary>
        /// Lấy người dùng
        /// </summary>
        [HttpGet("{id}")]
        public async Task<UserDto> GetAsync(Guid id)
        {
            return await _userAppService.GetAsync(id);
        }

        /// <summary>
        /// Lấy danh sách người dùng
        /// </summary>
        [HttpGet]
        public async Task<PagedResultDto<UserItemDto>> GetListAsync(UserPagedAndSortedResultRequestDto input)
        {
            return await _userAppService.GetListAsync(input);
        }

        /// <summary>
        /// Đổi mật khẩu người dùng
        /// </summary>
        [HttpPost("{id}/change-password")]
        public async Task ChangePasswordAsync(Guid id, [FromBody] ChangePasswordRequest request)
        {
            await _userAppService.ChangePasswordAsync(id, request.CurrentPassword, request.NewPassword);
        }

        /// <summary>
        /// Đặt lại mật khẩu người dùng (thao tác của quản trị viên)
        /// </summary>
        [HttpPost("{id}/reset-password")]
        public async Task ResetPasswordAsync(Guid id, [FromBody] ResetPasswordRequest request)
        {
            await _userAppService.ResetPasswordAsync(id, request.NewPassword);
        }

        /// <summary>
        /// Bật hoặc tắt người dùng
        /// </summary>
        [HttpPost("{id}/set-active")]
        public async Task SetUserActiveStatusAsync(Guid id, [FromBody] SetUserActiveRequest request)
        {
            await _userAppService.SetUserActiveStatusAsync(id, request.IsActive);
        }
    }

    /// <summary>
    /// Yêu cầu đổi mật khẩu
    /// </summary>
    public class ChangePasswordRequest
    {
        /// <summary>
        /// Mật khẩu hiện tại
        /// </summary>
        public string CurrentPassword { get; set; }

        /// <summary>
        /// Mật khẩu mới
        /// </summary>
        public string NewPassword { get; set; }
    }

    /// <summary>
    /// Yêu cầu đặt lại mật khẩu
    /// </summary>
    public class ResetPasswordRequest
    {
        /// <summary>
        /// Mật khẩu mới
        /// </summary>
        public string NewPassword { get; set; }
    }

    /// <summary>
    /// Yêu cầu đặt trạng thái người dùng
    /// </summary>
    public class SetUserActiveRequest
    {
        /// <summary>
        /// Có bật hay không
        /// </summary>
        public bool IsActive { get; set; }
    }
}
