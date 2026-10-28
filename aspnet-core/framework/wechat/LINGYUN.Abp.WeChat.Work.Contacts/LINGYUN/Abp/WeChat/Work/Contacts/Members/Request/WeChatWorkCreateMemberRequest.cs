using JetBrains.Annotations;
using LINGYUN.Abp.WeChat.Work.Common.Members.Models;
using LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Request;
/// <summary>
/// Tham số yêu cầu tạo thành viên
/// </summary>
/// <remarks>
/// Xem chi tiết tại: <see href="https://developer.work.weixin.qq.com/document/path/90195" />
/// </remarks>
public class WeChatWorkCreateMemberRequest : WeChatWorkRequest
{
    /// <summary>
    /// UserID của thành viên. Tương ứng với tài khoản trong trang quản trị, phải là duy nhất trong doanh nghiệp. Độ dài 1~64 byte. Chỉ được gồm các ký tự số, chữ cái và bốn ký tự “_-@.”, ký tự đầu tiên phải là số hoặc chữ cái. Khi hệ thống kiểm tra tính duy nhất sẽ bỏ qua chữ hoa/thường.
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    [StringLength(64, MinimumLength = 1)]
    public string UserId { get; set; }
    /// <summary>
    /// Tên thành viên. Độ dài 1~64 ký tự utf8
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    [StringLength(64, MinimumLength = 1)]
    public string Name { get; set; }
    /// <summary>
    /// Bí danh của thành viên. Độ dài 1~64 ký tự utf8
    /// </summary>
    [CanBeNull]
    [JsonProperty("alias")]
    [JsonPropertyName("alias")]
    [StringLength(64, MinimumLength = 1)]
    public string? Alias { get; set; }
    /// <summary>
    /// Số điện thoại di động. Phải là duy nhất trong doanh nghiệp, mobile/email không được đồng thời để trống. Số điện thoại tại Trung Quốc đại lục có thể bỏ “+86”, các quốc gia hoặc khu vực khác bắt buộc phải kèm mã quốc tế.
    /// </summary>
    [CanBeNull]
    [JsonProperty("mobile")]
    [JsonPropertyName("mobile")]
    public string? Mobile { get; set; }
    /// <summary>
    /// Danh sách id các phòng ban mà thành viên thuộc về, không vượt quá 100 phòng ban. Khi không điền department hoặc id bằng 0, thành viên sẽ được đặt trong mục Khác (phòng ban chờ thiết lập); khi phòng ban đã điền không tồn tại, hệ thống sẽ tạo phòng ban tương ứng trong mục Khác (phòng ban chờ thiết lập)
    /// </summary>
    [CanBeNull]
    [JsonProperty("department")]
    [JsonPropertyName("department")]
    public int[]? Department { get; set; }
    /// <summary>
    /// Giá trị sắp xếp trong phòng ban, mặc định là 0, thứ tự thành viên được sắp xếp theo thời gian tạo từ nhỏ đến lớn. Số lượng phải bằng số lượng của tham số department, giá trị càng lớn càng xếp trước. Phạm vi giá trị hợp lệ là [0, 2^32)
    /// </summary>
    [CanBeNull]
    [JsonProperty("order")]
    [JsonPropertyName("order")]
    public int[]? Order { get; set; }
    /// <summary>
    /// Thông tin chức vụ. Độ dài 0~128 ký tự
    /// </summary>
    [CanBeNull]
    [StringLength(128)]
    [JsonProperty("position")]
    [JsonPropertyName("position")]
    public string? Position { get; set; }
    /// <summary>
    /// Giới tính
    /// </summary>
    [CanBeNull]
    [JsonProperty("gender")]
    [JsonPropertyName("gender")]
    [Newtonsoft.Json.JsonConverter(typeof(Newtonsoft.Json.EnumToNumberStringConverter<Gender>))]
    [System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.EnumToNumberStringConverter<Gender>))]
    public Gender? Gender { get; set; }
    /// <summary>
    /// Email. Có thể điền tài khoản email mà doanh nghiệp đã có để đồng nghiệp dễ dàng lấy email của thành viên để gửi thư. Độ dài 6~64 byte và phải đúng định dạng email hợp lệ. Phải là duy nhất trong doanh nghiệp, mobile/email không được đồng thời để trống. Thành viên ở nước ngoài có thể dùng email này để đăng nhập WeChat Work.
    /// </summary>
    [CanBeNull]
    [StringLength(64)]
    [JsonProperty("email")]
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    /// <summary>
    /// Nếu doanh nghiệp đã kích hoạt Tencent Enterprise Mail (email của WeChat Work), việc đặt giá trị này sẽ tạo tài khoản email doanh nghiệp. Độ dài 6~64 byte và phải đúng định dạng email doanh nghiệp hợp lệ. Phải là duy nhất trong doanh nghiệp. Nếu không điền, hệ thống sẽ tạo email doanh nghiệp mặc định cho người dùng (email do hệ thống tạo có thể sửa một lần)
    /// </summary>
    [CanBeNull]
    [StringLength(64)]
    [JsonProperty("biz_mail")]
    [JsonPropertyName("biz_mail")]
    public string? BizEmail { get; set; }
    /// <summary>
    /// Điện thoại bàn. Tối đa 32 byte, gồm chữ số thuần túy, “-”, “+” hoặc “,”.
    /// </summary>
    [CanBeNull]
    [StringLength(32)]
    [JsonProperty("telephone")]
    [JsonPropertyName("telephone")]
    public string? TelePhone { get; set; }
    /// <summary>
    /// Số lượng phải bằng số lượng của tham số department, cho biết thành viên có phải là người phụ trách phòng ban tại phòng ban đó hay không. 1 nghĩa là người phụ trách phòng ban, 0 nghĩa là không phải người phụ trách phòng ban. Trong các ứng dụng phê duyệt (tự xây dựng, bên thứ ba) có thể dùng để xác định người phê duyệt cấp trên
    /// </summary>
    [CanBeNull]
    [JsonProperty("is_leader_in_dept")]
    [JsonPropertyName("is_leader_in_dept")]
    public int[]? IsLeaderInDept { get; set; }
    /// <summary>
    /// UserID của cấp trên trực tiếp, phạm vi đặt là thành viên trong doanh nghiệp, có thể đặt tối đa 1 cấp trên
    /// </summary>
    [CanBeNull]
    [JsonProperty("direct_leader")]
    [JsonPropertyName("direct_leader")]
    public string[]? DirectLeader { get; set; }
    /// <summary>
    /// mediaid ảnh đại diện của thành viên, là mediaid thu được khi tải ảnh lên qua giao diện quản lý tài liệu
    /// </summary>
    [CanBeNull]
    [JsonProperty("avatar_mediaid")]
    [JsonPropertyName("avatar_mediaid")]
    public string? AvatarMediaId { get; set; }
    /// <summary>
    /// Bật/tắt thành viên. 1 nghĩa là bật thành viên, 0 nghĩa là tắt thành viên
    /// </summary>
    [CanBeNull]
    [JsonProperty("enable")]
    [JsonPropertyName("enable")]
    public int? Enable { get; set; }
    /// <summary>
    /// Thuộc tính mở rộng. Các trường thuộc tính mở rộng cần được thêm trước trong trang quản trị WEB, xem phương pháp thêm thuộc tính mở rộng, nếu không hệ thống sẽ bỏ qua việc gán các thuộc tính không xác định. Xem chi tiết trường trong thuộc tính mở rộng của thành viên
    /// </summary>
    [CanBeNull]
    [JsonProperty("extattr")]
    [JsonPropertyName("extattr")]
    public MemberExternalAttribute? ExternalAttribute { get; set; }
    /// <summary>
    /// Có mời thành viên này sử dụng WeChat Work hay không (lời mời sẽ được gửi qua thông báo dịch vụ WeChat, SMS hoặc email, tự động gửi mỗi ngày một lần, tối đa 3 ngày làm việc), giá trị mặc định là true.
    /// </summary>
    [CanBeNull]
    [JsonProperty("to_invite")]
    [JsonPropertyName("to_invite")]
    public bool? ToInvite { get; set; }
    /// <summary>
    /// Thuộc tính đối ngoại của thành viên, xem chi tiết trường trong thuộc tính đối ngoại
    /// </summary>
    [CanBeNull]
    [JsonProperty("external_profile")]
    [JsonPropertyName("external_profile")]
    public ExternalProfile? ExternalProfile { get; set; }
    /// <summary>
    /// Chức vụ đối ngoại, nếu đặt giá trị này thì sẽ dùng nó làm chức vụ hiển thị ra bên ngoài, nếu không sẽ hiển thị position. Độ dài tối đa 12 ký tự tiếng Trung
    /// </summary>
    [CanBeNull]
    [StringLength(12)]
    [JsonProperty("external_position")]
    [JsonPropertyName("external_position")]
    public string? ExternalPosition { get; set; }
    /// <summary>
    /// Tên kênh video (sau khi đặt, thành viên sẽ hiển thị kênh video này ra bên ngoài). Phải chọn từ các kênh video mà doanh nghiệp đã liên kết với WeChat Work, có thể xem các kênh video đã liên kết trong trang “Doanh nghiệp của tôi”
    /// </summary>
    [CanBeNull]
    [JsonProperty("nickname")]
    [JsonPropertyName("nickname")]
    public string? NickName { get; set; }
    /// <summary>
    /// Địa chỉ. Độ dài tối đa 128 ký tự
    /// </summary>
    [CanBeNull]
    [StringLength(128)]
    [JsonProperty("address")]
    [JsonPropertyName("address")]
    public string? Address { get; set; }
    /// <summary>
    /// Phòng ban chính
    /// </summary>
    [CanBeNull]
    [JsonProperty("main_department")]
    [JsonPropertyName("main_department")]
    public int? MainDepartment { get; set; }

    public WeChatWorkCreateMemberRequest(
        string userId,
        string name)
    {
        UserId = userId;
        Name = name;
    }

    protected override void Validate()
    {
        Check.NotNullOrWhiteSpace(UserId, nameof(UserId), 64, 1);
        Check.NotNullOrWhiteSpace(Name, nameof(Name), 64, 1);
        Check.Length(Alias, nameof(Alias), 64, 1);
        Check.Length(Position, nameof(Position), 128);
        Check.Length(Email, nameof(Email), 64, 6);
        Check.Length(BizEmail, nameof(BizEmail), 64, 6);
        Check.Length(TelePhone, nameof(TelePhone), 32);
        Check.Length(ExternalPosition, nameof(ExternalPosition), 12);
        Check.Length(Address, nameof(Address), 128);
        // mobile/email không được đồng thời để trống
        if (Mobile.IsNullOrWhiteSpace() && Email.IsNullOrWhiteSpace())
        {
            throw new ArgumentException("mobile and email cannot be empty at the same time!");
        }
        // Danh sách id các phòng ban mà thành viên thuộc về, không vượt quá 100 phòng ban
        if (Department?.Length > 0)
        {
            // Danh sách id các phòng ban mà thành viên thuộc về, không vượt quá 100 phòng ban
            if (Department?.Length > 100)
            {
                throw new ArgumentException("The list of department ids to which members belong shall not exceed 100!");
            }
            // Số lượng danh sách sắp xếp phòng ban phải bằng số lượng của tham số department
            if (Order?.Length != Department?.Length)
            {
                throw new ArgumentException("The number of Order must be consistent with the number of the parameter \"department\"!");
            }
            // Số lượng danh sách người phụ trách phòng ban phải bằng số lượng của tham số department
            if (IsLeaderInDept?.Length != Department?.Length)
            {
                throw new ArgumentException("The number of IsLeaderInDept must be consistent with the number of the parameter \"Department\"!");
            }
        }
        // Tối đa chỉ được đặt một cấp trên trực tiếp
        if (DirectLeader?.Length > 1)
        {
            throw new ArgumentException("At most, only one direct superior can be set up!");
        }
        // Chỉ có thể tồn tại hai giá trị
        if (Enable.HasValue && Enable != 0)
        {
            Enable = 1;
        }
    }
}
