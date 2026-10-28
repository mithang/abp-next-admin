using System;
using System.Text.Json.Serialization.Metadata;

namespace LINGYUN.Abp.OpenObserve.Serialization.Modifiers;

/// <summary>
/// Bộ điều chỉnh tuần tự hóa bỏ qua các trường null của mô hình dữ liệu
/// </summary>
/// <remarks>
public static class OpenObserveIgnoreNullPropertiesModifier
{
    /// <summary>
    /// Không gian tên của mô hình dữ liệu trong thư viện này
    /// </summary>
    public const string ModelsNamespace = "LINGYUN.Abp.OpenObserve.Models";

    public static void Modify(JsonTypeInfo jsonTypeInfo)
    {
        if (jsonTypeInfo.Type.Namespace == null ||
            !jsonTypeInfo.Type.Namespace.StartsWith(ModelsNamespace, StringComparison.Ordinal))
        {
            return;
        }

        foreach (var property in jsonTypeInfo.Properties)
        {
            property.ShouldSerialize = (_, value) => value != null;
        }
    }
}
