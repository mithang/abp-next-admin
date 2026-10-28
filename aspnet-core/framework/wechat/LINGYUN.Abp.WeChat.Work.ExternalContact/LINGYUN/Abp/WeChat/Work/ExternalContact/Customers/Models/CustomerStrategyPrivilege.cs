using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Quyền nhóm quy tắc
/// </summary>
public class CustomerStrategyPrivilege
{
    /// <summary>
    /// Xem danh sách khách hàng, quyền cơ bản, không thể hủy
    /// </summary>
    [NotNull]
    [JsonProperty("view_customer_list")]
    [JsonPropertyName("view_customer_list")]
    public bool ViewCustomerList { get; set; }
    /// <summary>
    /// Xem dữ liệu thống kê khách hàng, quyền cơ bản, không thể hủy
    /// </summary>
    [NotNull]
    [JsonProperty("view_customer_data")]
    [JsonPropertyName("view_customer_data")]
    public bool ViewCustomerData { get; set; }
    /// <summary>
    /// Xem danh sách trò chuyện nhóm, quyền cơ bản, không thể hủy
    /// </summary>
    [NotNull]
    [JsonProperty("view_room_list")]
    [JsonPropertyName("view_room_list")]
    public bool ViewRoomList { get; set; }
    /// <summary>
    /// Có thể sử dụng Liên hệ tôi, quyền cơ bản, không thể hủy
    /// </summary>
    [NotNull]
    [JsonProperty("contact_me")]
    [JsonPropertyName("contact_me")]
    public bool ContactMe { get; set; }
    /// <summary>
    /// Có thể tham gia trò chuyện nhóm, quyền cơ bản, không thể hủy
    /// </summary>
    [NotNull]
    [JsonProperty("join_room")]
    [JsonPropertyName("join_room")]
    public bool JoinRoom { get; set; }
    /// <summary>
    /// Cho phép chia sẻ khách hàng cho thành viên khác, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("share_customer")]
    [JsonPropertyName("share_customer")]
    public bool ShareCustomer { get; set; }
    /// <summary>
    /// Cho phép phân bổ khách hàng của thành viên đã nghỉ việc, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("oper_resign_customer")]
    [JsonPropertyName("oper_resign_customer")]
    public bool OperResignCustomer { get; set; }
    /// <summary>
    /// Cho phép phân bổ nhóm khách hàng của thành viên đã nghỉ việc, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("oper_resign_group")]
    [JsonPropertyName("oper_resign_group")]
    public bool OperResignGroup { get; set; }
    /// <summary>
    /// Cho phép gửi tin nhắn cho khách hàng doanh nghiệp, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("send_customer_msg")]
    [JsonPropertyName("send_customer_msg")]
    public bool SendCustomerMsg { get; set; }
    /// <summary>
    /// Cho phép cấu hình lời chào mừng, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("edit_welcome_msg")]
    [JsonPropertyName("edit_welcome_msg")]
    public bool EditWelcomeMsg { get; set; }
    /// <summary>
    /// Cho phép xem thống kê liên hệ khách hàng của thành viên, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("view_behavior_data")]
    [JsonPropertyName("view_behavior_data")]
    public bool ViewBehaviorData { get; set; }
    /// <summary>
    /// 	Cho phép xem thống kê dữ liệu trò chuyện nhóm, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("view_room_data")]
    [JsonPropertyName("view_room_data")]
    public bool ViewRoomData { get; set; }
    /// <summary>
    /// Cho phép gửi tin nhắn vào nhóm khách hàng của doanh nghiệp, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("send_group_msg")]
    [JsonPropertyName("send_group_msg")]
    public bool SendGroupMsg { get; set; }
    /// <summary>
    /// Cho phép loại bỏ trùng lặp cho nhóm khách hàng doanh nghiệp, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("room_deduplication")]
    [JsonPropertyName("room_deduplication")]
    public bool RoomDeduplication { get; set; }
    /// <summary>
    /// Cấu hình trả lời nhanh, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("rapid_reply")]
    [JsonPropertyName("rapid_reply")]
    public bool RapidReply { get; set; }
    /// <summary>
    /// Chuyển giao khách hàng của thành viên đang làm việc, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("onjob_customer_transfer")]
    [JsonPropertyName("onjob_customer_transfer")]
    public bool OnjobCustomerTransfer { get; set; }
    /// <summary>
    /// Chỉnh sửa quy tắc chống quấy rối của thành viên doanh nghiệp, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("edit_anti_spam_rule")]
    [JsonPropertyName("edit_anti_spam_rule")]
    public bool EditAntiSpamRule { get; set; }
    /// <summary>
    /// Xuất danh sách khách hàng, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("export_customer_list")]
    [JsonPropertyName("export_customer_list")]
    public bool ExportCustomerList { get; set; }
    /// <summary>
    /// Xuất thống kê khách hàng của thành viên, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("export_customer_data")]
    [JsonPropertyName("export_customer_data")]
    public bool ExportCustomerData { get; set; }
    /// <summary>
    /// Xuất danh sách nhóm khách hàng, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("export_customer_group_list")]
    [JsonPropertyName("export_customer_group_list")]
    public bool ExportCustomerGroupList { get; set; }
    /// <summary>
    /// Cấu hình thẻ khách hàng doanh nghiệp, mặc định là true
    /// </summary>
    [NotNull]
    [JsonProperty("manage_customer_tag")]
    [JsonPropertyName("manage_customer_tag")]
    public bool ManageCustomerTag { get; set; }

    public static CustomerStrategyPrivilege Default()
    {
        return new CustomerStrategyPrivilege
        {
            ViewCustomerList = true,
            ViewCustomerData = true,
            ViewRoomList = true,
            ContactMe = true,
            JoinRoom = true,
            ShareCustomer = true,
            EditWelcomeMsg = true,
            ViewBehaviorData = true,
            ViewRoomData = true,
            SendGroupMsg = true,
            RoomDeduplication = true,
            RapidReply = true,
            OnjobCustomerTransfer = true,
            EditAntiSpamRule = true,
            ExportCustomerList = true,
            ExportCustomerData = true,
            ExportCustomerGroupList = true,
            ManageCustomerTag = true,
        };
    }
}
