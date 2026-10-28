using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;

namespace PackageName.CompanyName.ProjectName.Users
{
    /// <summary>
    /// Thực thể người dùng
    /// </summary>
    public class User : FullAuditedEntity<Guid>
    {
        /// <summary>
        /// Tên người dùng
        /// </summary>
        [MaxLength(50)]
        public string NickName { get; set; }

        /// <summary>
        /// Id người dùng Identity
        /// </summary>
        public Guid IdentityUserId { get; set; }

        /// <summary>
        /// Người dùng Identity
        /// </summary>
        public virtual IdentityUser IdentityUser { get; set; }
        
        /// <summary>
        /// Thông tin liên hệ
        /// </summary>
        [MaxLength(50)]
        public string ContactInfo { get; set; }
        
        /// <summary>
        /// Chức vụ
        /// </summary>
        [MaxLength(50)]
        public string Position { get; set; }

        protected User()
        {
        }

        public User(
            Guid id,
            string nickName,
            Guid identityUserId,
            string contactInfo = null,
            string position = null
        ) : base(id)
        {
            NickName = nickName;
            IdentityUserId = identityUserId;
            ContactInfo = contactInfo;
            Position = position;
        }
    }
}
