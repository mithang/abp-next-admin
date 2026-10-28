using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Volo.Abp.Auditing;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.DataProtection;
public class AbpDataProtectionOptions
{
    /// <summary>
    /// Có bật kiểm toán dữ liệu hay không
    /// Mặc định: true
    /// </summary>
    public bool IsEnabled { get; set; }
    /// <summary>
    /// Chính sách quyền dữ liệu
    /// </summary>
    public IList<IDataAccessStrategyContributor> StrategyContributors { get; }
    /// <summary>
    /// Chủ thể quyền
    /// </summary>
    public IList<IDataAccessSubjectContributor> SubjectContributors { get; }
    /// <summary>
    /// Từ khóa trường lọc
    /// </summary>
    public IDictionary<string, IDataAccessKeywordContributor> KeywordContributors { get; }
    /// <summary>
    /// Thao tác dữ liệu
    /// </summary>
    public IDictionary<DataAccessFilterOperate, IDataAccessOperateContributor> OperateContributors { get; }
    /// <summary>
    /// Bộ lọc thực thể mặc định
    /// </summary>
    public IDictionary<Type, Func<IServiceProvider, Type, DataAccessOperation, LambdaExpression>> DefaultEntityFilters { get; }
    /// <summary>
    /// Trường bỏ qua của thực thể
    /// </summary>
    public IDictionary<Type, string[]> EntityIgnoreProperties { get; }
    /// <summary>
    /// Danh sách trường bỏ qua toàn cục (không tham gia kiểm tra quyền cấp trường)
    /// </summary>
    public IList<string> GlobalIgnoreProperties { get; set; }
    /// <summary>
    /// Danh sách trường kiểm toán (các trường này được ghi vào danh sách thuộc tính của thực thể được bảo vệ, dùng để lọc ở phía giao diện)
    /// </summary>
    public IList<string> AuditedObjectProperties { get; set; }
    public AbpDataProtectionOptions()
    {
        IsEnabled = true;
        SubjectContributors = new List<IDataAccessSubjectContributor>();
        StrategyContributors = new List<IDataAccessStrategyContributor>();
        KeywordContributors = new Dictionary<string, IDataAccessKeywordContributor>();
        OperateContributors = new Dictionary<DataAccessFilterOperate, IDataAccessOperateContributor>();
        DefaultEntityFilters = new Dictionary<Type, Func<IServiceProvider, Type, DataAccessOperation, LambdaExpression>>();
        EntityIgnoreProperties = new Dictionary<Type, string[]>();

        GlobalIgnoreProperties = new List<string>
        {
            nameof(IEntity<Guid>.Id),
            nameof(IAuditedObject.LastModifierId),
            nameof(IAuditedObject.LastModificationTime),
            nameof(IAuditedObject.CreatorId),
            nameof(IAuditedObject.CreationTime),
            nameof(IDeletionAuditedObject.IsDeleted),
            nameof(IDeletionAuditedObject.DeleterId),
            nameof(IDeletionAuditedObject.DeletionTime),
            nameof(IMultiTenant.TenantId),
            nameof(IHasEntityVersion.EntityVersion),
            nameof(IHasConcurrencyStamp.ConcurrencyStamp),
            nameof(IHasExtraProperties.ExtraProperties),
        };

        AuditedObjectProperties = new List<string>
        {
            nameof(IAuditedObject.LastModifierId),
            nameof(IAuditedObject.LastModificationTime),
            nameof(IAuditedObject.CreatorId),
            nameof(IAuditedObject.CreationTime),
        };
    }
}
