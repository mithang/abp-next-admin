using LINGYUN.Abp.WeChat.Work.Common.Members.Models;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Sự kiện thay đổi thành viên
/// </summary>
public abstract class UserChangeEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Loại thay đổi
    /// </summary>
    [XmlElement("ChangeType")]
    public string ChangeType { get; set; } = default!;
    /// <summary>
    /// UserID của thành viên
    /// </summary>
    [XmlElement("UserID")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Tên thành viên; ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền mới trả về
    /// </summary>
    [XmlElement("Name")]
    public string? Name { get; set; }
    /// <summary>
    /// Danh sách phòng ban của thành viên, chỉ trả về id phòng ban mà ứng dụng này có quyền xem
    /// </summary>
    [XmlElement("Department")]
    public string? Department { get; set; }
    /// <summary>
    /// Phòng ban chính
    /// </summary>
    [XmlElement("MainDepartment")]
    public string MainDepartment { get; set; } = default!;
    /// <summary>
    /// Cho biết có phải là người phụ trách phòng ban nơi thành viên thuộc về hay không,
    /// 0-Không,
    /// 1-Có,
    /// Thứ tự tương ứng từng phòng ban với trường Department.
    /// Ứng dụng danh bạ bên thứ ba, hoặc ứng dụng bên thứ ba và ứng dụng phát triển thay đã được cấp quyền "Thông tin tổ chức - Ứng dụng có thể lấy thông tin tổ chức phòng ban của doanh nghiệp - Người phụ trách phòng ban" có thể lấy được;
    /// Đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ bên thứ ba không thể lấy được;
    /// Doanh nghiệp cấp trên không thể lấy trường này của thành viên doanh nghiệp cấp dưới
    /// </summary>
    [XmlElement("IsLeaderInDept")]
    public string IsLeaderInDept { get; set; } = default!;
    /// <summary>
    /// UserID của cấp trên trực tiếp, tối đa 1 người.
    /// Ứng dụng danh bạ bên thứ ba, hoặc ứng dụng bên thứ ba và ứng dụng phát triển thay đã được cấp quyền "Thông tin tổ chức - Ứng dụng có thể lấy thông tin tổ chức thành viên trong phạm vi hiển thị - Cấp trên trực tiếp" có thể lấy được;
    /// Đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ bên thứ ba không thể lấy được;
    /// Doanh nghiệp cấp trên không thể lấy trường này của thành viên doanh nghiệp cấp dưới
    /// </summary>
    [XmlElement("DirectLeader")]
    public string DirectLeader { get; set; } = default!;
    /// <summary>
    /// Thông tin chức vụ.
    /// Độ dài 0~64 byte; ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền mới trả về.
    /// Ứng dụng chia sẻ từ cấp trên không trả về trường này
    /// </summary>
    [XmlElement("Position")]
    public string? Position { get; set; }
    /// <summary>
    /// Số điện thoại di động, ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền và thành viên ủy quyền oauth2 mới lấy được;
    /// Chỉ ứng dụng danh bạ bên thứ ba mới lấy được;
    /// Đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ bên thứ ba cũng không thể lấy được;
    /// Doanh nghiệp cấp trên không thể lấy trường này của thành viên doanh nghiệp cấp dưới
    /// </summary>
    [XmlElement("Mobile")]
    public string? Mobile { get; set; }
    /// <summary>
    /// Giới tính.
    /// 0 nghĩa là chưa xác định,
    /// 1 nghĩa là nam,
    /// 2 nghĩa là nữ.
    /// Ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền và thành viên ủy quyền oauth2 mới lấy được;
    /// Chỉ ứng dụng danh bạ bên thứ ba mới lấy được;
    /// Đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ bên thứ ba cũng không thể lấy được;
    /// Doanh nghiệp cấp trên không thể lấy trường này của thành viên doanh nghiệp cấp dưới。
    /// Lưu ý: không lấy được nghĩa là giá trị trả về là 0
    /// </summary>
    [XmlElement("Gender")]
    public byte Gender { get; set; }
    /// <summary>
    /// Email,
    /// Ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền và thành viên ủy quyền oauth2 mới lấy được;
    /// Chỉ ứng dụng danh bạ bên thứ ba mới lấy được;
    /// Đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ bên thứ ba cũng không thể lấy được;
    /// Doanh nghiệp cấp trên không thể lấy trường này của thành viên doanh nghiệp cấp dưới
    /// </summary>
    [XmlElement("Email")]
    public string? Email { get; set; }
    /// <summary>
    /// Email doanh nghiệp,
    /// Ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền và thành viên ủy quyền oauth2 mới lấy được;
    /// Chỉ ứng dụng danh bạ bên thứ ba mới lấy được;
    /// Đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ bên thứ ba cũng không thể lấy được;
    /// Doanh nghiệp cấp trên không thể lấy trường này của thành viên doanh nghiệp cấp dưới
    /// </summary>
    [XmlElement("BizMail")]
    public string? BizMail { get; set; }
    /// <summary>
    /// Trạng thái kích hoạt:
    /// 1=Đã kích hoạt
    /// 2=Đã vô hiệu hóa
    /// 4=Chưa kích hoạt  Đã kích hoạt nghĩa là đã kích hoạt WeChat doanh nghiệp hoặc đã theo dõi plugin WeChat (tài khoản doanh nghiệp cũ)
    /// 5=Thành viên rời khỏi
    /// </summary>
    [XmlElement("Status")]
    public byte Status { get; set; }
    /// <summary>
    /// URL ảnh đại diện.
    /// Lưu ý: nếu muốn lấy ảnh nhỏ, chỉ cần đổi "/0" cuối URL thành "/100".
    /// Ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền và thành viên ủy quyền oauth2 mới lấy được;
    /// Chỉ ứng dụng danh bạ bên thứ ba mới lấy được;
    /// Đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ bên thứ ba cũng không thể lấy được;
    /// Doanh nghiệp cấp trên không thể lấy trường này của thành viên doanh nghiệp cấp dưới
    /// </summary>
    [XmlElement("Avatar")]
    public string? Avatar { get; set; }
    /// <summary>
    /// Bí danh thành viên.
    /// Ứng dụng chia sẻ từ cấp trên không trả về trường này
    /// </summary>
    [XmlElement("Alias")]
    public string? Alias { get; set; }
    /// <summary>
    /// Điện thoại bàn;
    /// Ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền mới trả về.
    /// Ứng dụng chia sẻ từ cấp trên không trả về trường này
    /// </summary>
    [XmlElement("Telephone")]
    public string? Telephone { get; set; }
    /// <summary>
    /// Địa chỉ.
    /// Ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền và thành viên ủy quyền oauth2 mới lấy được;
    /// Chỉ ứng dụng danh bạ bên thứ ba mới lấy được;
    /// Đối với thành viên không do bên thứ ba tạo, ứng dụng danh bạ bên thứ ba cũng không thể lấy được;
    /// Doanh nghiệp cấp trên không thể lấy trường này của thành viên doanh nghiệp cấp dưới
    /// </summary>
    [XmlElement("Address")]
    public string? Address { get; set; }
    /// <summary>
    /// Thuộc tính mở rộng;
    /// Ứng dụng tự xây dựng phát triển thay cần được quản trị viên ủy quyền mới trả về.
    /// Ứng dụng chia sẻ từ cấp trên không trả về trường này
    /// </summary>
    [XmlArray("ExtAttr")]
    public MemberExtendAttribute? ExtendAttribute { get; set; }
}
