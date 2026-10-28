using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;

namespace PackageName.CompanyName.ProjectName.Users
{
    /// <summary>
    /// Dịch vụ quản lý người dùng, dùng để xử lý các thao tác CRUD của người dùng
    /// </summary>
    public class UserManager : DomainService, IUserManager
    {
        private readonly IUserRepository _userRepository;
        private readonly IdentityUserManager _identityUserManager;
        private readonly ILogger<UserManager> _logger;

        public UserManager(
            IUserRepository userRepository,
            IdentityUserManager identityUserManager,
            ILogger<UserManager> logger)
        {
            _userRepository = userRepository;
            _identityUserManager = identityUserManager;
            _logger = logger;
        }

        /// <summary>
        /// Tạo người dùng mới
        /// </summary>
        /// <param name="nickName">Biệt danh người dùng</param>
        /// <param name="password">Mật khẩu người dùng</param>
        /// <param name="contactInfo">Thông tin liên hệ</param>
        /// <param name="position">Chức vụ</param>
        /// <param name="isActive">Có bật hay không</param>
        /// <returns>Thực thể người dùng đã tạo</returns>
        public async Task<User> CreateAsync(
            string nickName,
            string password,
            string contactInfo = null,
            string position = null,
            bool isActive = true)
        {
            // Kiểm tra tham số
            if (string.IsNullOrWhiteSpace(nickName))
            {
                throw new UserFriendlyException("Tên người dùng không được để trống");
            }

            // Kiểm tra mật khẩu
            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
            {
                throw new UserFriendlyException("Mật khẩu không được để trống và độ dài không được dưới 6 ký tự");
            }

            // Kiểm tra biệt danh người dùng đã tồn tại hay chưa
            var existingUser = await _userRepository.FindAsync(u => u.NickName == nickName);
            if (existingUser != null)
            {
                throw new UserFriendlyException($"Người dùng có biệt danh '{nickName}' đã tồn tại");
            }

            // Tạo người dùng Identity
            var identityUser = new IdentityUser(GuidGenerator.Create(), nickName, $"{nickName}@inspection.com");
            var identityResult = await _identityUserManager.CreateAsync(identityUser, password);
            if (!identityResult.Succeeded)
            {
                throw new UserFriendlyException("Tạo người dùng thất bại: " +
                                                string.Join(", ", identityResult.Errors.Select(x => x.Description)));
            }

            // Đặt trạng thái người dùng
            if (!isActive)
            {
                var lockoutResult = await _identityUserManager.SetLockoutEndDateAsync(identityUser, DateTimeOffset.MaxValue);
                if (!lockoutResult.Succeeded)
                {
                    throw new UserFriendlyException("Đặt trạng thái người dùng thất bại: " +
                        string.Join(", ", lockoutResult.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                // Đảm bảo người dùng đang ở trạng thái hoạt động
                await _identityUserManager.SetLockoutEnabledAsync(identityUser, false);
                var lockoutResult = await _identityUserManager.SetLockoutEndDateAsync(identityUser, null);
                if (!lockoutResult.Succeeded)
                {
                    throw new UserFriendlyException("Đặt trạng thái người dùng thất bại: " +
                        string.Join(", ", lockoutResult.Errors.Select(e => e.Description)));
                }
            }

            // Tạo người dùng nghiệp vụ
            var user = new User(
                GuidGenerator.Create(),
                nickName,
                identityUser.Id,
                contactInfo,
                position
            );

            // Lưu người dùng
            await _userRepository.InsertAsync(user, true);

            _logger.LogInformation($"Đã tạo người dùng mới: {nickName}, ID: {user.Id}");

            return user;
        }

        /// <summary>
        /// Cập nhật thông tin người dùng
        /// </summary>
        /// <param name="id">ID người dùng</param>
        /// <param name="nickName">Biệt danh người dùng</param>
        /// <param name="password">Mật khẩu người dùng (tùy chọn, nếu không sửa thì truyền null)</param>
        /// <param name="contactInfo">Thông tin liên hệ</param>
        /// <param name="position">Chức vụ</param>
        /// <param name="isActive">Có bật hay không</param>
        /// <returns>Thực thể người dùng sau khi cập nhật</returns>
        public async Task<User> UpdateAsync(
            Guid id,
            string nickName,
            string password,
            string contactInfo = null,
            string position = null,
            bool isActive = true)
        {
            // Số lần thử lại tối đa
            const int maxRetries = 3;
            int retryCount = 0;

            while (true)
            {
                try
                {
                    // Mỗi lần thử lại lấy lại dữ liệu người dùng mới nhất
                    var user = await _userRepository.GetAsync(id, false);
                    if (user == null)
                    {
                        throw new UserFriendlyException("Người dùng không tồn tại");
                    }
                    
                    // Kiểm tra biệt danh người dùng đã bị người dùng khác sử dụng hay chưa
                    var existingUser = await _userRepository.FindAsync(u => u.NickName == nickName && u.Id != id);
                    if (existingUser != null)
                    {
                        throw new UserFriendlyException($"Người dùng có biệt danh '{nickName}' đã tồn tại");
                    }

                    // Cập nhật người dùng Identity
                    var identityUser = await _identityUserManager.FindByIdAsync(user.IdentityUserId.ToString());
                    if (identityUser == null)
                    {
                        throw new UserFriendlyException("Người dùng Identity không tồn tại");
                    }

                    // Cập nhật tên người dùng
                    var usernameResult = await _identityUserManager.SetUserNameAsync(identityUser, nickName);
                    if (!usernameResult.Succeeded)
                    {
                        throw new UserFriendlyException("Cập nhật tên người dùng thất bại: " +
                            string.Join(", ", usernameResult.Errors.Select(e => e.Description)));
                    }

                    // Cập nhật email
                    var emailResult = await _identityUserManager.SetEmailAsync(identityUser, $"{nickName}@inspection.com");
                    if (!emailResult.Succeeded)
                    {
                        throw new UserFriendlyException("Cập nhật email thất bại: " +
                            string.Join(", ", emailResult.Errors.Select(e => e.Description)));
                    }

                    // Nếu đã cung cấp mật khẩu mới thì cập nhật mật khẩu
                    if (!string.IsNullOrEmpty(password))
                    {
                        // Xóa mật khẩu hiện tại
                        await _identityUserManager.RemovePasswordAsync(identityUser);
                        // Đặt mật khẩu mới
                        var passwordResult = await _identityUserManager.AddPasswordAsync(identityUser, password);
                        if (!passwordResult.Succeeded)
                        {
                            throw new UserFriendlyException("Cập nhật mật khẩu thất bại: " +
                                string.Join(", ", passwordResult.Errors.Select(e => e.Description)));
                        }
                    }

                    // Đặt trạng thái người dùng
                    await SetUserActiveStatusAsync(id, isActive);

                    // Cập nhật thông tin người dùng
                    user.NickName = nickName;
                    user.ContactInfo = contactInfo;
                    user.Position = position;

                    // Lưu cập nhật
                    await _userRepository.UpdateAsync(user, true);

                    _logger.LogInformation($"Đã cập nhật thông tin người dùng: {nickName}, ID: {user.Id}");

                    return user;
                }
                catch (Volo.Abp.Data.AbpDbConcurrencyException ex)
                {
                    // Tăng bộ đếm thử lại
                    retryCount++;

                    // Nếu đạt số lần thử lại tối đa thì ném ngoại lệ thân thiện với người dùng
                    if (retryCount >= maxRetries)
                    {
                        throw new UserFriendlyException(
                            "Cập nhật thông tin người dùng thất bại: dữ liệu đã bị người dùng khác sửa đổi. Vui lòng làm mới trang rồi thử lại.",
                            "409", ex.Message,
                            ex);
                    }

                    // Chờ một lúc rồi thử lại
                    await Task.Delay(100 * retryCount); // Tăng dần thời gian chờ

                    // Ghi lại thông tin thử lại
                    _logger.LogWarning($"Phát hiện xung đột đồng thời khi người dùng [{id}] cập nhật, đang thực hiện lần thử lại thứ {retryCount}...");
                }
            }
        }

        /// <summary>
        /// Xóa người dùng
        /// </summary>
        /// <param name="id">ID người dùng</param>
        /// <returns>Tác vụ thao tác</returns>
        public async Task DeleteAsync(Guid id)
        {
            // Số lần thử lại tối đa
            const int maxRetries = 3;
            int retryCount = 0;

            while (true)
            {
                try
                {
                    // Mỗi lần thử lại lấy lại dữ liệu người dùng mới nhất
                    var user = await _userRepository.GetAsync(id);
                    if (user == null)
                    {
                        _logger.LogWarning($"Đang thử xóa người dùng không tồn tại, ID: {id}");
                        return; // Nếu người dùng không tồn tại thì không tiếp tục xử lý nữa
                    }

                    // Xóa người dùng Identity
                    var identityUser = await _identityUserManager.FindByIdAsync(user.IdentityUserId.ToString());
                    if (identityUser != null)
                    {
                        var result = await _identityUserManager.DeleteAsync(identityUser);
                        if (!result.Succeeded)
                        {
                            throw new UserFriendlyException("Xóa người dùng Identity thất bại: " +
                                string.Join(", ", result.Errors.Select(e => e.Description)));
                        }
                    }

                    // Xóa người dùng
                    await _userRepository.DeleteAsync(user);

                    _logger.LogInformation($"Đã xóa người dùng, ID: {id}");
                    return;
                }
                catch (Volo.Abp.Data.AbpDbConcurrencyException ex)
                {
                    // Tăng bộ đếm thử lại
                    retryCount++;

                    // Nếu đạt số lần thử lại tối đa thì ném ngoại lệ thân thiện với người dùng
                    if (retryCount >= maxRetries)
                    {
                        throw new UserFriendlyException(
                            "Xóa người dùng thất bại: dữ liệu đã bị người dùng khác sửa đổi. Vui lòng làm mới trang rồi thử lại.",
                            "409", ex.Message,
                            ex);
                    }

                    // Chờ một lúc rồi thử lại
                    await Task.Delay(100 * retryCount); // Tăng dần thời gian chờ

                    // Ghi lại thông tin thử lại
                    _logger.LogWarning($"Phát hiện xung đột đồng thời khi người dùng [{id}] xóa, đang thực hiện lần thử lại thứ {retryCount}...");
                }
            }
        }

        /// <summary>
        /// Đổi mật khẩu người dùng
        /// </summary>
        /// <param name="id">ID người dùng</param>
        /// <param name="currentPassword">Mật khẩu hiện tại</param>
        /// <param name="newPassword">Mật khẩu mới</param>
        /// <returns>Kết quả thao tác</returns>
        public async Task ChangePasswordAsync(Guid id, string currentPassword, string newPassword)
        {
            if (string.IsNullOrEmpty(newPassword) || newPassword.Length < 6)
            {
                throw new UserFriendlyException("Mật khẩu mới không được để trống và độ dài không được dưới 6 ký tự");
            }

            // Lấy người dùng
            var user = await _userRepository.GetAsync(id);
            if (user == null)
            {
                throw new UserFriendlyException("Người dùng không tồn tại");
            }

            // Lấy người dùng Identity
            var identityUser = await _identityUserManager.FindByIdAsync(user.IdentityUserId.ToString());
            if (identityUser == null)
            {
                throw new UserFriendlyException("Người dùng Identity không tồn tại");
            }

            // Đổi mật khẩu
            var result = await _identityUserManager.ChangePasswordAsync(identityUser, currentPassword, newPassword);
            if (!result.Succeeded)
            {
                throw new UserFriendlyException("Đổi mật khẩu thất bại: " +
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            _logger.LogInformation($"Người dùng [{user.NickName}] đã đổi mật khẩu thành công");
        }

        /// <summary>
        /// Đặt lại mật khẩu người dùng (thao tác của quản trị viên)
        /// </summary>
        /// <param name="id">ID người dùng</param>
        /// <param name="newPassword">Mật khẩu mới</param>
        /// <returns>Kết quả thao tác</returns>
        public async Task ResetPasswordAsync(Guid id, string newPassword)
        {
            if (string.IsNullOrEmpty(newPassword) || newPassword.Length < 6)
            {
                throw new UserFriendlyException("Mật khẩu mới không được để trống và độ dài không được dưới 6 ký tự");
            }

            // Lấy người dùng
            var user = await _userRepository.GetAsync(id);
            if (user == null)
            {
                throw new UserFriendlyException("Người dùng không tồn tại");
            }

            // Lấy người dùng Identity
            var identityUser = await _identityUserManager.FindByIdAsync(user.IdentityUserId.ToString());
            if (identityUser == null)
            {
                throw new UserFriendlyException("Người dùng Identity không tồn tại");
            }

            // Tạo mã thông báo đặt lại
            var token = await _identityUserManager.GeneratePasswordResetTokenAsync(identityUser);

            // Đặt lại mật khẩu
            var result = await _identityUserManager.ResetPasswordAsync(identityUser, token, newPassword);
            if (!result.Succeeded)
            {
                throw new UserFriendlyException("Đặt lại mật khẩu thất bại: " +
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            _logger.LogInformation($"Quản trị viên đã đặt lại mật khẩu của người dùng [{user.NickName}]");
        }

        /// <summary>
        /// Lấy thông tin người dùng
        /// </summary>
        /// <param name="id">ID người dùng</param>
        /// <returns>Thực thể người dùng</returns>
        public async Task<User> GetAsync(Guid id)
        {
            return await _userRepository.GetAsync(id);
        }

        /// <summary>
        /// Lấy người dùng theo ID người dùng Identity
        /// </summary>
        /// <param name="identityUserId">ID người dùng Identity</param>
        /// <returns>Thực thể người dùng, nếu không tồn tại thì trả về null</returns>
        public async Task<User> FindByIdentityUserIdAsync(Guid identityUserId)
        {
            return await _userRepository.FindAsync(u => u.IdentityUserId == identityUserId);
        }

        /// <summary>
        /// Tìm người dùng theo biệt danh người dùng
        /// </summary>
        /// <param name="nickName">Biệt danh người dùng</param>
        /// <returns>Thực thể người dùng, nếu không tồn tại thì trả về null</returns>
        public async Task<User> FindByNickNameAsync(string nickName)
        {
            return await _userRepository.FindAsync(u => u.NickName == nickName);
        }

        /// <summary>
        /// Vô hiệu hóa hoặc bật người dùng
        /// </summary>
        /// <param name="id">ID người dùng</param>
        /// <param name="isActive">Có bật hay không</param>
        /// <returns>Tác vụ thao tác</returns>
        public async Task SetUserActiveStatusAsync(Guid id, bool isActive)
        {
            // Lấy người dùng
            var user = await _userRepository.GetAsync(id);
            if (user == null)
            {
                throw new UserFriendlyException("Người dùng không tồn tại");
            }

            // Lấy người dùng Identity
            var identityUser = await _identityUserManager.FindByIdAsync(user.IdentityUserId.ToString());
            if (identityUser == null)
            {
                throw new UserFriendlyException("Người dùng Identity không tồn tại");
            }

            // Đặt trạng thái người dùng
            if (isActive)
            {
                // Bật người dùng
                var result = await _identityUserManager.SetLockoutEndDateAsync(identityUser, null);
                if (!result.Succeeded)
                {
                    throw new UserFriendlyException($"Bật người dùng thất bại: " +
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                // Vô hiệu hóa người dùng (đặt khóa vĩnh viễn)
                var result = await _identityUserManager.SetLockoutEndDateAsync(identityUser, DateTimeOffset.MaxValue);
                if (!result.Succeeded)
                {
                    throw new UserFriendlyException($"Vô hiệu hóa người dùng thất bại: " +
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }

            _logger.LogInformation($"Đã {(isActive ? "bật" : "vô hiệu hóa")} người dùng [{user.NickName}]");
        }
    }
}
