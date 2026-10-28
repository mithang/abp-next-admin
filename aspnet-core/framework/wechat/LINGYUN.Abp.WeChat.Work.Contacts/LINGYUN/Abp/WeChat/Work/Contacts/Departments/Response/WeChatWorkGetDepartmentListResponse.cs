using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Departments.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Response;
/// <summary>
/// Tham số phản hồi lấy danh sách phòng ban
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90208" />
/// </remarks>
public class WeChatWorkGetDepartmentListResponse : WeChatWorkResponse
{
    /// <summary>
    /// Dữ liệu danh sách phòng ban
    /// </summary>
    [NotNull]
    [JsonProperty("department")]
    [JsonPropertyName("department")]
    public DepartmentInfo[] Department { get; set; } = default!;
}
