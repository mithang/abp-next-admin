using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Departments.Request;
/// <summary>
/// Tham số yêu cầu lấy danh sách ID phòng ban con
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/95350" />
/// </remarks>
public class WeChatWorkGetSubDepartmentListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Id phòng ban. Lấy phòng ban được chỉ định cùng các phòng ban con của nó (và các phòng ban con của phòng ban con, v.v., đệ quy). Nếu không điền, mặc định lấy toàn bộ cơ cấu tổ chức
    /// </summary>
    [CanBeNull]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int? Id { get; }
    public WeChatWorkGetSubDepartmentListRequest(int? id = null)
    {
        Id = id;
    }
}
