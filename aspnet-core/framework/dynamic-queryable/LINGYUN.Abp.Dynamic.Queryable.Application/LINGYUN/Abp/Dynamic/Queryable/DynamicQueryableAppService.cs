using LINGYUN.Linq.Dynamic.Queryable;
using LINGYUN.Linq.Dynamic.Queryable.Reflection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.Dynamic.Queryable;

public abstract class DynamicQueryableAppService<TEntity, TEntityDto> : ApplicationService, IDynamicQueryableAppService<TEntityDto>
{
    /// <summary>
    /// Lấy danh sách trường khả dụng
    /// </summary>
    /// <returns></returns>
    public virtual Task<ListResultDto<DynamicParamterDto>> GetAvailableFieldsAsync()
    {
        var options = LazyServiceProvider.LazyGetRequiredService<IOptions<AbpDynamicQueryableOptions>>().Value;

        var entityType = typeof(TEntity);
        var dynamicParamters = new List<DynamicParamterDto>();

        var igonreFields = options
            .IgnoreFields
            .Union(GetUserDefineIgnoreFields())
            .Distinct();

        var propertyInfos = entityType
            .GetProperties()
            .Where(p => !igonreFields.Contains(p.Name));

        foreach (var propertyInfo in propertyInfos)
        {
            // Quy tắc mô tả bản địa hóa trường
            // Định nghĩa DisplayName:PropertyName trong tệp bản địa hóa
            var localizedProp = L[$"DisplayName:{propertyInfo.Name}"];
            var propertyTypeMap = GetPropertyTypeMap(propertyInfo.PropertyType);
            var dynamicParamter = new DynamicParamterDto
            {
                Name = propertyInfo.Name,
                Type = propertyInfo.PropertyType.FullName!,
                Description = localizedProp.Value ?? propertyInfo.Name,
                JavaScriptType = propertyTypeMap.JavaScriptType,
                AvailableComparator = propertyTypeMap.AvailableComparator
            };

            var propertyType = propertyInfo.PropertyType;
            if (propertyType.IsNullableType())
            {
                propertyType = propertyType.GetGenericArguments().FirstOrDefault();
            }

            if (typeof(Enum).IsAssignableFrom(propertyType))
            {
                var enumNames = Enum.GetNames(propertyType);
                var enumValues = Enum.GetValues(propertyType);
                var paramterOptions = new ParamterOptionDto[enumNames.Length];
                for (var index = 0; index < enumNames.Length; index++)
                {
                    var enumName = enumNames[index];
                    var localizerEnumKey = $"{propertyInfo.Name}:{enumName}";
                    var localizerEnumName = L[localizerEnumKey];
                    paramterOptions[index] = new ParamterOptionDto
                    {
                        Key = localizerEnumName.ResourceNotFound ? enumName : localizerEnumName.Value,
                        Value = enumValues.GetValue(index),
                    };
                }
                dynamicParamter.Options = paramterOptions;
            }

            dynamicParamters.Add(dynamicParamter);
        }

        return Task.FromResult(new ListResultDto<DynamicParamterDto>(dynamicParamters));
    }

    /// <summary>
    /// Truy vấn dữ liệu theo điều kiện động
    /// </summary>
    /// <param name="dynamicInput"></param>
    /// <returns></returns>
    public async virtual Task<PagedResultDto<TEntityDto>> SearchAsync(GetListByDynamicQueryableInput dynamicInput)
    {
        Expression<Func<TEntity, bool>> condition = (e) => true;

        condition = condition.DynamicQuery(dynamicInput.Queryable);

        var totalCount = await GetCountAsync(condition);
        var entities = await GetListAsync(condition, dynamicInput);

        return new PagedResultDto<TEntityDto>(totalCount,
            MapToEntitiesDto(entities));
    }

    protected abstract Task<int> GetCountAsync(Expression<Func<TEntity, bool>> condition);

    protected abstract Task<List<TEntity>> GetListAsync(
        Expression<Func<TEntity, bool>> condition,
        PagedAndSortedResultRequestDto pageRequest);

    protected virtual List<TEntityDto> MapToEntitiesDto(List<TEntity> entities)
    {
        return ObjectMapper.Map<List<TEntity>, List<TEntityDto>>(entities);
    }

    protected virtual string[] GetUserDefineIgnoreFields()
    {
        return new string[0];
    }

    protected virtual (string JavaScriptType, DynamicComparison[] AvailableComparator) GetPropertyTypeMap(Type propertyType)
    {
        var isNullableType = false;
        var availableComparator = new List<DynamicComparison>();
        if (propertyType.IsNullableType())
        {
            isNullableType = true;
            propertyType = propertyType.GetGenericArguments().First();
        }

        if (typeof(Enum).IsAssignableFrom(propertyType))
        {
            // Kiểu enum chỉ hỗ trợ các toán tử sau
            // nhỏ hơn, nhỏ hơn hoặc bằng, lớn hơn, lớn hơn hoặc bằng, bằng, không bằng, rỗng, không rỗng
            availableComparator.AddRange(new[]
            {
                DynamicComparison.GreaterThan,
                DynamicComparison.GreaterThanOrEqual,
                DynamicComparison.LessThan,
                DynamicComparison.LessThanOrEqual,
                DynamicComparison.Equal,
                DynamicComparison.NotEqual,
            });
            if (isNullableType)
            {
                availableComparator.AddRange(new[]
                {
                        DynamicComparison.Null,
                        DynamicComparison.NotNull
                    });
            }
            return ("number", availableComparator.ToArray());
        }

        var typeFullName = propertyType.FullName;

        switch (typeFullName)
        {
            case "System.Int16":
            case "System.Int32":
            case "System.Int64":
            case "System.UInt16":
            case "System.UInt32":
            case "System.UInt64":
            case "System.Single":
            case "System.Double":
            case "System.Byte":
            case "System.SByte":
            case "System.Decimal":
                // Kiểu số chỉ hỗ trợ các toán tử sau
                // nhỏ hơn, nhỏ hơn hoặc bằng, lớn hơn, lớn hơn hoặc bằng, bằng, không bằng, rỗng, không rỗng
                availableComparator.AddRange(new[]
                {
                    DynamicComparison.GreaterThan,
                    DynamicComparison.GreaterThanOrEqual,
                    DynamicComparison.LessThan,
                    DynamicComparison.LessThanOrEqual,
                    DynamicComparison.Equal,
                    DynamicComparison.NotEqual,
                });
                if (isNullableType)
                {
                    availableComparator.AddRange(new[]
                    {
                        DynamicComparison.Null,
                        DynamicComparison.NotNull
                    });
                }
                return ("number", availableComparator.ToArray());
            case "System.Boolean":
            case "System.Guid":
                // Kiểu Boolean, Guid chỉ hỗ trợ các toán tử sau
                // bằng, không bằng, rỗng, không rỗng
                availableComparator.AddRange(new[]
                {
                    DynamicComparison.Equal,
                    DynamicComparison.NotEqual,
                });
                if (isNullableType)
                {
                    availableComparator.AddRange(new[]
                    {
                        DynamicComparison.Null,
                        DynamicComparison.NotNull
                    });
                }
                return ("boolean", availableComparator.ToArray());
            case "System.Char":
            case "System.String":
                // Kiểu ký tự hỗ trợ tất cả các toán tử
                return ("string", availableComparator.ToArray());
            case "System.DateTime":
                // Kiểu thời gian chỉ hỗ trợ các toán tử sau
                // nhỏ hơn, nhỏ hơn hoặc bằng, lớn hơn, lớn hơn hoặc bằng, bằng, không bằng, rỗng, không rỗng
                availableComparator.AddRange(new[]
                {
                    DynamicComparison.GreaterThan,
                    DynamicComparison.GreaterThanOrEqual,
                    DynamicComparison.LessThan,
                    DynamicComparison.LessThanOrEqual,
                    DynamicComparison.Equal,
                    DynamicComparison.NotEqual,
                });
                if (isNullableType)
                {
                    availableComparator.AddRange(new[]
                    {
                        DynamicComparison.Null,
                        DynamicComparison.NotNull
                    });
                }
                return ("Date", availableComparator.ToArray());
            default:
            case "System.Object":
            case "System.DBNull":
                if (isNullableType)
                {
                    availableComparator.AddRange(new[]
                    {
                        DynamicComparison.Null,
                        DynamicComparison.NotNull
                    });
                }
                if (propertyType.IsArray)
                {
                    // Kiểu mảng chỉ hỗ trợ các toán tử sau
                    // chứa, không chứa, rỗng, không rỗng
                    availableComparator.AddRange(new[]
                    {
                        DynamicComparison.Contains,
                        DynamicComparison.NotContains,
                    });

                    return ("array", availableComparator.ToArray());
                }
                else
                {
                    // Kiểu đối tượng không xác định chỉ hỗ trợ các toán tử sau
                    // bằng, không bằng, rỗng, không rỗng
                    availableComparator.AddRange(new[]
                   {
                        DynamicComparison.Equal,
                        DynamicComparison.NotEqual,
                    });
                    return ("object", availableComparator.ToArray());
                }
        }
    }
}
