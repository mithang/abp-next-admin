using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.DataProtection;

public class JavaScriptTypeConvert : IJavaScriptTypeConvert, ISingletonDependency
{
    public JavaScriptTypeConvertResult Convert(Type propertyType)
    {
        var (JavaScriptType, AccessOperates) =  InnerConvert(propertyType);

        return new JavaScriptTypeConvertResult(JavaScriptType, AccessOperates);
    }

    protected virtual (string JavaScriptType, DataAccessFilterOperate[] AccessFilterOperates) InnerConvert(Type propertyType)
    {
        var availableComparator = new List<DataAccessFilterOperate>();
        if (propertyType.IsNullableType())
        {
            propertyType = propertyType.GetGenericArguments().First();
        }

        if (typeof(Enum).IsAssignableFrom(propertyType))
        {
            // Kiểu enum chỉ hỗ trợ các toán tử sau
            // Nhỏ hơn, nhỏ hơn hoặc bằng, lớn hơn, lớn hơn hoặc bằng, bằng, không bằng, rỗng, không rỗng
            availableComparator.AddRange(new[]
            {
                DataAccessFilterOperate.Greater,
                DataAccessFilterOperate.GreaterOrEqual,
                DataAccessFilterOperate.Less,
                DataAccessFilterOperate.LessOrEqual,
                DataAccessFilterOperate.Equal,
                DataAccessFilterOperate.NotEqual,
            });
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
                // Nhỏ hơn, nhỏ hơn hoặc bằng, lớn hơn, lớn hơn hoặc bằng, bằng, không bằng, rỗng, không rỗng
                availableComparator.AddRange(new[]
                {
                    DataAccessFilterOperate.Greater,
                    DataAccessFilterOperate.GreaterOrEqual,
                    DataAccessFilterOperate.Less,
                    DataAccessFilterOperate.LessOrEqual,
                    DataAccessFilterOperate.Equal,
                    DataAccessFilterOperate.NotEqual,
                });
                return ("number", availableComparator.ToArray());
            case "System.Boolean":
                // Kiểu boolean chỉ hỗ trợ các toán tử sau
                // Bằng, không bằng, rỗng, không rỗng
                availableComparator.AddRange(new[]
                {
                    DataAccessFilterOperate.Equal,
                    DataAccessFilterOperate.NotEqual,
                });
                return ("boolean", availableComparator.ToArray());
            case "System.Guid":
                // Kiểu Guid chỉ hỗ trợ các toán tử sau
                // Bằng, không bằng, rỗng, không rỗng
                availableComparator.AddRange(new[]
                {
                    DataAccessFilterOperate.Equal,
                    DataAccessFilterOperate.NotEqual,
                });
                return ("string", availableComparator.ToArray());
            case "System.Char":
            case "System.String":
                // Kiểu ký tự hỗ trợ tất cả các toán tử
                return ("string", availableComparator.ToArray());
            case "System.DateTime":
                // Kiểu thời gian chỉ hỗ trợ các toán tử sau
                // Nhỏ hơn, nhỏ hơn hoặc bằng, lớn hơn, lớn hơn hoặc bằng, bằng, không bằng, rỗng, không rỗng
                availableComparator.AddRange(new[]
                {
                    DataAccessFilterOperate.Greater,
                    DataAccessFilterOperate.GreaterOrEqual,
                    DataAccessFilterOperate.Less,
                    DataAccessFilterOperate.LessOrEqual,
                    DataAccessFilterOperate.Equal,
                    DataAccessFilterOperate.NotEqual,
                });
                return ("Date", availableComparator.ToArray());
            default:
            case "System.Object":
            case "System.DBNull":
                if (propertyType.IsArray)
                {
                    // Kiểu mảng chỉ hỗ trợ các toán tử sau
                    // Chứa, không chứa, rỗng, không rỗng
                    availableComparator.AddRange(new[]
                    {
                        DataAccessFilterOperate.Contains,
                        DataAccessFilterOperate.NotContains,
                    });

                    return ("array", availableComparator.ToArray());
                }
                else
                {
                    // Kiểu đối tượng không xác định chỉ hỗ trợ các toán tử sau
                    // Bằng, không bằng, rỗng, không rỗng
                    availableComparator.AddRange(new[]
                   {
                        DataAccessFilterOperate.Equal,
                        DataAccessFilterOperate.NotEqual,
                    });
                    return ("object", availableComparator.ToArray());
                }
        }
    }
}
