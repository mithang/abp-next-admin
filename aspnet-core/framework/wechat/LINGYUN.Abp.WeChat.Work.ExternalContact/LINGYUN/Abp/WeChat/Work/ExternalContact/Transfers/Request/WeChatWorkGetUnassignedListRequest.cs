using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Transfers.Request;
public class WeChatWorkGetUnassignedListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Con trỏ truy vấn phân trang, kiểu chuỗi, dùng khi khối lượng dữ liệu lớn; nếu dùng tham số này thì không cần điền page_id, tham số này do lần gọi trước trả về
    /// </summary>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public string? Cursor { get; set; }
    /// <summary>
    /// Số bản ghi tối đa trả về mỗi lần, mặc định là 1000, giá trị tối đa là 1000
    /// </summary>
    [CanBeNull]
    [JsonProperty("page_size")]
    [JsonPropertyName("page_size")]
    public int? PageSize { get; set; }
    public WeChatWorkGetUnassignedListRequest(string? cursor = null, int? pageSize = 1000)
    {
        Cursor = cursor;
        PageSize = pageSize;
    }
}
