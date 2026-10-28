namespace LINGYUN.Platform;

public static class PlatformErrorCodes
{
    private const string Namespace = "Platform";

    public const string VersionFileNotFound = Namespace + ":01404";
    /// <summary>
    /// Phiên bản gói không thể hạ cấp
    /// </summary>
    public const string PackageVersionDegraded = Namespace + ":01403";
    /// <summary>
    /// Menu cùng cấp đã tồn tại
    /// </summary>
    public const string DuplicateMenu = Namespace + ":02001";
    /// <summary>
    /// Không thể xóa nút có menu con
    /// </summary>
    public const string DeleteMenuHaveChildren = Namespace + ":02002";
    /// <summary>
    /// Cấp menu đã đạt giá trị tối đa
    /// </summary>
    public const string MenuAchieveMaxDepth = Namespace + ":02003";
    /// <summary>
    /// Menu hiện tại không thể trùng với menu cấp trên
    /// </summary>
    public const string CannotSetSelfParentMenu = Namespace + ":02004";
    /// <summary>
    /// Siêu dữ liệu menu thiếu các phần tử bắt buộc
    /// </summary>
    public const string MenuMissingMetadata = Namespace + ":02101";
    /// <summary>
    /// Định dạng siêu dữ liệu không khớp
    /// </summary>
    public const string MetaFormatMissMatch = Namespace + ":03001";
    /// <summary>
    /// Người dùng đã lưu menu trùng lặp
    /// </summary>
    public const string UserDuplicateFavoriteMenu = Namespace + ":04400";
    /// <summary>
    /// Không tìm thấy menu người dùng đã lưu
    /// </summary>
    public const string UserFavoriteMenuNotFound = Namespace + ":04404";
    /// <summary>
    /// Không thể bình luận về vấn đề đang ở trạng thái {Status}
    /// </summary>
    public const string UnableFeedbackCommentInStatus = Namespace + ":05101";
    /// <summary>
    /// Không thể thêm tệp đính kèm trùng lặp {Name}!
    /// </summary>
    public const string DuplicateFeedbackAttachment = Namespace + ":05102";
    /// <summary>
    /// Phản hồi của người dùng không tìm thấy tệp đính kèm tên {Name}!
    /// </summary>
    public const string FeedackAttachmentNotFound = Namespace + ":05103";
    /// <summary>
    /// Tệp đính kèm {Name} đã hết hiệu lực, vui lòng tải lên lại!
    /// </summary>
    public const string FeedackAttachmentLoseEffectiveness = Namespace + ":05104";
    /// <summary>
    /// Không thể thêm tiêu đề trùng lặp {Key}!
    /// </summary>
    public const string DuplicateEmailMessageHeader = Namespace + ":06101";
    /// <summary>
    /// Không thể thêm tệp đính kèm trùng lặp {Name}!
    /// </summary>
    public const string DuplicateEmailMessageAttachment = Namespace + ":06102";
    /// <summary>
    /// Đã tồn tại thông tin doanh nghiệp tên {Name}!
    /// </summary>
    public const string DuplicateEnterpriseName = Namespace + ":07101";
}
