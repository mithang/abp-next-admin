using System;
using Volo.Abp.Application.Dtos;

namespace PackageName.CompanyName.ProjectName.Users.Dtos
{
    [Serializable]
    public class UserPagedAndSortedResultRequestDto : PagedAndSortedResultRequestDto
    {
        /// <summary>
        /// Tên người dùng
        /// </summary>
        public string NickName { get; set; }
    }
}