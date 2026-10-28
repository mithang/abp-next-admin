namespace LINGYUN.Abp.MessageService;

/// <summary>
/// Thiết kế mã lỗi của hệ thống tin nhắn
/// Mã trạng thái gồm hai phần: 2 ký tự đầu là lĩnh vực, 3 ký tự sau là trạng thái
/// 
/// <list type="table">
/// Phần lĩnh vực:
///     01  Đầu vào
///     02  Nhóm
///     03  Người dùng
///     04  Ứng dụng
///     05  Nội bộ
///     10  Đầu ra
/// </list>
/// 
/// <list type="table">
/// Phần trạng thái:
///     200-299 Thành công
///     300-399 Thành công nhưng còn thao tác tiếp theo
///     400-499 Ngoại lệ nghiệp vụ
///     500-599 Ngoại lệ nội bộ
///     900-999 Ngoại lệ đầu vào/đầu ra
/// </list>
/// 
/// </summary>
public class MessageServiceErrorCodes
{
    public const string Namespace = "LINGYUN.Abp.Message";
    /// <summary>
    /// Đang cố thu hồi tin nhắn đã hết hạn
    /// </summary>
    public const string ExpiredMessageCannotBeReCall = Namespace + ":01303";
    /// <summary>
    /// Tin nhắn không đầy đủ
    /// </summary>
    public const string MessageIncomplete = Namespace + ":01400";
    /// <summary>
    /// Bạn chưa tham gia nhóm, không thể thực hiện thao tác
    /// </summary>
    public const string YouHaveNotJoinedGroup = Namespace + ":01401";
    /// <summary>
    /// Đã gửi yêu cầu tham gia nhóm, đang chờ quản trị viên đồng ý
    /// </summary>
    public const string YouHaveAddingToGroup = Namespace + ":02301";
    /// <summary>
    /// Bạn cần xác minh câu hỏi mới có thể tham gia trò chuyện nhóm
    /// </summary>
    public const string YouNeedValidationQuestingByAddGroup = Namespace + ":02302";
    /// <summary>
    /// Quản trị viên đã bật chế độ cấm phát biểu toàn bộ thành viên
    /// </summary>
    public const string GroupNotAllowedToSpeak = Namespace + ":02400";
    /// <summary>
    /// Quản trị viên đã cấm người dùng phát biểu
    /// </summary>
    public const string GroupUserHasBlack = Namespace + ":02403";
    /// <summary>
    /// Quản trị viên không cho phép phát biểu ẩn danh
    /// </summary>
    public const string GroupNotAllowedToSpeakAnonymously = Namespace + ":02401";
    /// <summary>
    /// Nhóm không tồn tại hoặc đã giải tán
    /// </summary>
    public const string GroupNotFount = Namespace + ":02404";
    /// <summary>
    /// Người dùng đã từ chối tất cả tin nhắn
    /// </summary>
    public const string UserHasRejectAllMessage = Namespace + ":03400";
    /// <summary>
    /// Người dùng đã chặn người gửi
    /// </summary>
    public const string UserHasBlack = Namespace + ":03401";
    /// <summary>
    /// Người dùng không cho phép phát biểu ẩn danh
    /// </summary>
    public const string UserNotAllowedToSpeakAnonymously = Namespace + ":03402";
    /// <summary>
    /// Người dùng không nhận phát biểu từ người không phải bạn bè
    /// </summary>
    public const string UserHasRejectNotFriendMessage = Namespace + ":03403";
    /// <summary>
    /// Người dùng nhận tin nhắn không tồn tại hoặc đã hủy tài khoản
    /// </summary>
    public const string UseNotFount = Namespace + ":03404";
    /// <summary>
    /// Người dùng từ chối kết bạn
    /// </summary>
    public const string UseRefuseToAddFriend = Namespace + ":03410";
    /// <summary>
    /// Đối phương đã là bạn bè của bạn hoặc đã gửi yêu cầu xác minh, không thể thao tác lặp lại
    /// </summary>
    public const string UseHasBeenAddedTheFriendOrSendAuthorization = Namespace + ":03411";
    /// <summary>
    /// Đã gửi yêu cầu kết bạn, đang chờ đối phương đồng ý
    /// </summary>
    public const string YouHaveAddingTheUserToFriend = Namespace + ":03301";
    /// <summary>
    /// Bạn cần xác minh câu hỏi mới có thể kết bạn
    /// </summary>
    public const string YouNeedValidationQuestingByAddFriend = Namespace + ":03302";
}
