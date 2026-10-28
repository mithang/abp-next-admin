using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Departments.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách ID phòng ban con
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/95350" />
/// </remarks>
public class WeChatWorkGetSubDepartmentListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Dữ liệu danh sách phòng ban.
    /// </summary>
    [NotNull]
    [JsonProperty("department_id")]
    [JsonPropertyName("department_id")]
    public SubDepartment[] Department { get; set; } = default!;
}
