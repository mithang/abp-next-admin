using System;
using Volo.Abp.Auditing;

namespace PackageName.CompanyName.ProjectName.TreeCodes
{
    /// <summary>
    /// Định nghĩa giao diện thực thể có mã cây
    /// </summary>
    public interface IHaveTreeCode : IHasCreationTime
    {
        /// <summary>
        /// Mã cây
        /// </summary>
        string TreeCode { get; set; }
        
        /// <summary>
        /// Id cấp cha
        /// </summary>
        Guid? ParentId { get; set; }
    }
}
