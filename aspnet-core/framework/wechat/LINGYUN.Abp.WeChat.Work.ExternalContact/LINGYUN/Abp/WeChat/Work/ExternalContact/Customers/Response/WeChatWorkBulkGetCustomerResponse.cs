using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Response;
/// <summary>
/// Tham số phản hồi lấy hàng loạt chi tiết khách hàng
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/92994" />
/// </remarks>
public class WeChatWorkBulkGetCustomerResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách userid của liên hệ bên ngoài
    /// </summary>
    [NotNull]
    [JsonProperty("external_contact_list")]
    [JsonPropertyName("external_contact_list")]
    public List<ExternalContactList> ExternalUserId { get; set; } = new List<ExternalContactList>();
    /// <summary>
    /// Con trỏ phân trang, điền vào lần yêu cầu tiếp theo để lấy các bản ghi của trang sau; nếu không còn dữ liệu nữa thì trả về rỗng
    /// </summary>
    [CanBeNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public string? NextCursor { get; set; }
    /// <summary>
    /// Nếu tất cả userid trong yêu cầu đều không có giấy phép liên thông hợp lệ, giao diện sẽ báo lỗi trực tiếp 701008. Nếu một phần userid không có giấy phép liên thông hợp lệ, giao diện vẫn trả về thành công
    /// </summary>
    [CanBeNull]
    [JsonProperty("fail_info")]
    [JsonPropertyName("fail_info")]
    public WeChatWorkBulkGetCustomerFailInfo? FailInfo { get; set; }
}

public class WeChatWorkBulkGetCustomerFailInfo
{
    /// <summary>
    /// Danh sách userid không có giấy phép
    /// </summary>
    [NotNull]
    [JsonProperty("next_cursor")]
    [JsonPropertyName("next_cursor")]
    public List<string> UnlicensedUseridList { get; set; } = new List<string>();
}