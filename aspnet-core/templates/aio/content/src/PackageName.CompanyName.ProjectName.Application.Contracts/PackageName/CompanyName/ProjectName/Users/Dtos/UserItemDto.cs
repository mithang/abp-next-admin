using System;
using Volo.Abp.Application.Dtos;

namespace PackageName.CompanyName.ProjectName.Users.Dtos
{
    [Serializable]
    public class UserItemDto : FullAuditedEntityDto<Guid>
    {
        /// <summary>
        /// Tên người dùng
        /// </summary>
        public string NickName { get; set; }

        /// <summary>
        /// Id người dùng Identity
        /// </summary>
        public Guid IdentityUserId { get; set; }

        /// <summary>
        /// Trạng thái người dùng
        /// </summary>
        public bool IsActive { get; set; }
        
        /// <summary>
        /// Thông tin liên hệ
        /// </summary>
        public string ContactInfo { get; set; }
        
        /// <summary>
        /// Chức vụ
        /// </summary>
        public string Position { get; set; }
        
        /// <summary>
        /// Tên vai trò
        /// </summary>
        public string RoleNames { get; set; }
    }
}