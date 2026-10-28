using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Nguồn khách hàng
/// </summary>
[Description("Nguồn khách hàng")]
public enum FollowUserAddWay
{
    /// <summary>
    /// Nguồn không xác định
    /// </summary>
    [Description("Nguồn không xác định")]
    None = 0,
    /// <summary>
    /// Quét mã QR
    /// </summary>
    [Description("Quét mã QR")]
    ScanQrCode = 1,
    /// <summary>
    /// Tìm kiếm theo số điện thoại
    /// </summary>
    [Description("Tìm kiếm theo số điện thoại")]
    SearchPhoneNumber = 2,
    /// <summary>
    /// Chia sẻ danh thiếp
    /// </summary>
    [Description("Chia sẻ danh thiếp")]
    SharedCard = 3,
    /// <summary>
    /// Trò chuyện nhóm
    /// </summary>
    [Description("Trò chuyện nhóm")]
    GroupChat = 4,
    /// <summary>
    /// Danh bạ điện thoại
    /// </summary>
    [Description("Danh bạ điện thoại")]
    PhoneBook = 5,
    /// <summary>
    /// Liên hệ WeChat
    /// </summary>
    [Description("Liên hệ WeChat")]
    WeChatContact = 6,
    /// <summary>
    /// Nhân viên chăm sóc khách hàng được thêm tự động khi cài đặt ứng dụng bên thứ ba
    /// </summary>
    [Description("Nhân viên chăm sóc khách hàng được thêm tự động khi cài đặt ứng dụng bên thứ ba")]
    InstallThirdPartyApp = 8,
    /// <summary>
    /// Tìm kiếm theo email
    /// </summary>
    [Description("Tìm kiếm theo email")]
    SearchEmail = 9,
    /// <summary>
    /// Thêm qua Video Channel
    /// </summary>
    [Description("Thêm qua Video Channel")]
    WechatChannel = 10,
    /// <summary>
    /// Thêm qua người tham gia lịch trình
    /// </summary>
    [Description("Thêm qua người tham gia lịch trình")]
    SchedulePart = 11,
    /// <summary>
    /// Thêm qua người tham gia cuộc họp
    /// </summary>
    [Description("Thêm qua người tham gia cuộc họp")]
    MeetPart = 12,
    /// <summary>
    /// WeChat doanh nghiệp tương ứng khi thêm bạn WeChat
    /// </summary>
    [Description("WeChat doanh nghiệp tương ứng khi thêm bạn WeChat")]
    WeChatFriend = 13,
    /// <summary>
    /// Thêm qua nhân viên chăm sóc khách hàng chuyên trách của thiết bị thông minh
    /// </summary>
    [Description("Thêm qua nhân viên chăm sóc khách hàng chuyên trách của thiết bị thông minh")]
    SmartHardware = 14,
    /// <summary>
    /// Thêm qua nhân viên chăm sóc khách hàng dịch vụ tận nơi
    /// </summary>
    [Description("Thêm qua nhân viên chăm sóc khách hàng dịch vụ tận nơi")]
    DoorService = 15,
    /// <summary>
    /// Thêm qua liên kết thu hút khách hàng
    /// </summary>
    [Description("Thêm qua liên kết thu hút khách hàng")]
    CustomerAcqLink = 16,
    /// <summary>
    /// Thêm qua phát triển tùy chỉnh
    /// </summary>
    [Description("Thêm qua phát triển tùy chỉnh")]
    CustomDevelopment = 17,
    /// <summary>
    /// Thêm qua phản hồi nhu cầu
    /// </summary>
    [Description("Thêm qua phản hồi nhu cầu")]
    DemandResponse = 18,
    /// <summary>
    /// Thêm qua nhân viên chăm sóc khách hàng trước bán hàng của bên thứ ba
    /// </summary>
    [Description("Thêm qua nhân viên chăm sóc khách hàng trước bán hàng của bên thứ ba")]
    ThirdPartyPreSales = 21,
    /// <summary>
    /// Thêm qua đối tác kinh doanh tiềm năng
    /// </summary>
    [Description("Thêm qua đối tác kinh doanh tiềm năng")]
    PotentialBusPart = 22,
    /// <summary>
    /// Thêm bằng cách chấp nhận lời mời kết bạn nhận được qua tài khoản WeChat
    /// </summary>
    [Description("Thêm bằng cách chấp nhận lời mời kết bạn nhận được qua tài khoản WeChat")]
    WeChatFriendRequest = 24,
    /// <summary>
    /// Chia sẻ bởi thành viên nội bộ
    /// </summary>
    [Description("Chia sẻ bởi thành viên nội bộ")]
    SharedByInternalMembers = 201,
    /// <summary>
    /// Phân công bởi quản trị viên/người phụ trách
    /// </summary>
    [Description("Phân công bởi quản trị viên/người phụ trách")]
    AllocationByAdmin = 202
}
