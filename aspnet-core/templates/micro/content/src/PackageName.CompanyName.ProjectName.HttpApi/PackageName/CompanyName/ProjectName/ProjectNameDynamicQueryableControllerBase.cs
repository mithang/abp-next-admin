using LINGYUN.Abp.Dynamic.Queryable;
using PackageName.CompanyName.ProjectName.Localization;

namespace PackageName.CompanyName.ProjectName;
/// <summary>
/// Cung cấp triển khai controller truy vấn động
/// </summary>
/// <typeparam name="TEntityDto">Kiểu dto thực thể</typeparam>
public abstract class ProjectNameDynamicQueryableControllerBase<TEntityDto> : DynamicQueryableControllerBase<TEntityDto>
{
    protected ProjectNameDynamicQueryableControllerBase(
        IDynamicQueryableAppService<TEntityDto> service)
        : base(service)
    {
        LocalizationResource = typeof(ProjectNameResource);
    }
}
