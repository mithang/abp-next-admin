using LINGYUN.Abp.Dynamic.Queryable;
using PackageName.CompanyName.ProjectName.Localization;

namespace PackageName.CompanyName.ProjectName;
/// <summary>
/// Cung cấp triển khai giao diện truy vấn động
/// </summary>
/// <typeparam name="TEntity">Kiểu thực thể</typeparam>
/// <typeparam name="TEntityDto">Kiểu DTO của thực thể</typeparam>
public abstract class ProjectNameDynamicQueryableAppServiceBase<TEntity, TEntityDto> :
    DynamicQueryableAppService<TEntity, TEntityDto>,
    IProjectNameDynamicQueryableAppService<TEntityDto>
{
    protected ProjectNameDynamicQueryableAppServiceBase()
    {
        LocalizationResource = typeof(ProjectNameResource);
        ObjectMapperContext = typeof(ProjectNameApplicationModule);
    }
}
