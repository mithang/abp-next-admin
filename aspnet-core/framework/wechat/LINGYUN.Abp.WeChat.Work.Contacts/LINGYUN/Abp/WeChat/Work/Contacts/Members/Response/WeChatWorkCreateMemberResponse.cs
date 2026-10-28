using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Contacts.Departments.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi tạo thành viên
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90195" />
/// </remarks>
public class WeChatWorkCreateMemberResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách phòng ban mới thêm do đã điền phòng ban không tồn tại
    /// </summary>
    [CanBeNull]
    [JsonProperty("created_department_list")]
    [JsonPropertyName("created_department_list")]
    public Department[]? CreatedDepartmentList { get; set; }
}
