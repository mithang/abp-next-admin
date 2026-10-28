using System;
using System.ComponentModel.DataAnnotations;

namespace PackageName.CompanyName.ProjectName.Users.Dtos
{
    [Serializable]
    public class CreateUpdateUserDto
    {
        /// <summary>
        /// Tên người dùng
        /// </summary>
        [Required(ErrorMessage = "Tên người dùng không được để trống")]
        [StringLength(50, ErrorMessage = "Độ dài tên người dùng không được vượt quá 50 ký tự")]
        public string NickName { get; set; }

        /// <summary>
        /// Mật khẩu
        /// </summary>
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Độ dài mật khẩu phải nằm trong khoảng 6-20 ký tự")]
        public string Password { get; set; }

        /// <summary>
        /// Thông tin liên hệ
        /// </summary>
        public string ContactInfo { get; set; }

        /// <summary>
        /// Chức vụ
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// Có bật hay không
        /// </summary>
        public bool IsActive { get; set; } = true;
    }
}