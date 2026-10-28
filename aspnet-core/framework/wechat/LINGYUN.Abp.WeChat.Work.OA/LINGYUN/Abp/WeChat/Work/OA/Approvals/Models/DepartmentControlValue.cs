using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển phòng ban
/// </summary>
public class DepartmentControlValue : ContactControlValue
{
    /// <summary>
    /// Nội dung phòng ban đã chọn, tức phòng ban mà người nộp đơn chọn trong điều khiển này, ở chế độ chọn nhiều có thể có nhiều phòng ban
    /// </summary>
    [NotNull]
    [JsonProperty("departments")]
    [JsonPropertyName("departments")]
    public List<DepartmentValue> Departments { get; set; } = default!;
    public DepartmentControlValue()
    {

    }

    private DepartmentControlValue(List<DepartmentValue> departments)
    {
        Departments = departments;
    }

    public static DepartmentControlValue Single(DepartmentValue department)
    {
        return new DepartmentControlValue(new List<DepartmentValue> { department });
    }

    public static DepartmentControlValue Multiple(List<DepartmentValue> departments)
    {
        return new DepartmentControlValue(departments);
    }
}

public class DepartmentValue
{
    /// <summary>
    /// id phòng ban đã chọn
    /// </summary>
    [NotNull]
    [JsonProperty("openapi_id")]
    [JsonPropertyName("openapi_id")]
    public string DepartmentId { get; set; } = default!;
    /// <summary>
    /// Tên phòng ban đã chọn
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    public DepartmentValue()
    {

    }

    public DepartmentValue(string departmentId, string name)
    {
        DepartmentId = departmentId;
        Name = name;
    }
}
