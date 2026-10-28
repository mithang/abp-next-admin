using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Request;
/// <summary>
/// Tham số yêu cầu lấy danh sách phòng ban
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/90208" />
/// </remarks>
public class WeChatWorkGetDepartmentListRequest : WeChatWorkRequest
{
    /// <summary>
    /// id phòng ban. Lấy phòng ban chỉ định và các phòng ban con của nó (cũng như phòng ban con của phòng ban con, v.v., đệ quy). Nếu không điền, mặc định lấy toàn bộ cơ cấu tổ chức
    /// </summary>
    [CanBeNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int? Id { get; }
    public WeChatWorkGetDepartmentListRequest(int? id = null)
    {
        Id = id;
    }
}
