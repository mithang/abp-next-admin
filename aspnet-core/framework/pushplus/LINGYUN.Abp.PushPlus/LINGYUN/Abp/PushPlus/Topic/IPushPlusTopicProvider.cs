using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.PushPlus.Topic;
/// <summary>
/// Giao diện nhóm
/// </summary>
public interface IPushPlusTopicProvider
{
    /// <summary>
    /// Lấy danh sách nhóm
    /// </summary>
    /// <param name="current">Số trang hiện tại</param>
    /// <param name="pageSize">Kích thước mỗi trang, giá trị tối đa là 50</param>
    /// <param name="topicType">Loại nhóm; 0 - do tôi tạo, 1 - tôi đã tham gia</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusPagedResponse<PushPlusTopic>> GetTopicListAsync(
        int current,
        int pageSize,
        PushPlusTopicType topicType = PushPlusTopicType.Create,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết nhóm do tôi tạo
    /// </summary>
    /// <param name="topicId">Mã số nhóm</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusTopicProfile> GetTopicProfileAsync(
        int topicId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy chi tiết nhóm tôi đã tham gia
    /// </summary>
    /// <param name="topicId">Mã số nhóm</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusTopicForMe> GetTopicForMeProfileAsync(
        int topicId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thêm nhóm mới
    /// </summary>
    /// <param name="topicCode">Mã nhóm</param>
    /// <param name="topicName">Tên nhóm</param>
    /// <param name="contact">Thông tin liên hệ</param>
    /// <param name="introduction">Giới thiệu nhóm</param>
    /// <param name="receiptMessage">Nội dung trả lời sau khi tham gia</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> CreateTopicAsync(
        string topicCode,
        string topicName,
        string contact,
        string introduction,
        string receiptMessage = "",
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy mã QR của nhóm
    /// </summary>
    /// <param name="topicId">Mã số nhóm</param>
    /// <param name="forever">Loại mã QR; 0 - mã QR tạm thời, 1 - mã QR vĩnh viễn</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusTopicQrCode> GetTopicQrCodeAsync(
        int topicId,
        PushPlusTopicQrCodeType forever = PushPlusTopicQrCodeType.Temporary,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Rời khỏi nhóm
    /// </summary>
    /// <param name="topicId">Mã số nhóm</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<string> QuitTopicAsync(
        int topicId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Lấy người dùng trong nhóm
    /// </summary>
    /// <param name="current">Số trang hiện tại</param>
    /// <param name="pageSize">Kích thước mỗi trang, giá trị tối đa là 50</param>
    /// <param name="topicId">Mã số nhóm</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusPagedResponse<PushPlusTopicUser>> GetSubscriberListAsync(
        int current,
        int pageSize,
        int topicId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa người dùng trong nhóm
    /// </summary>
    /// <param name="topicRelationId">Mã số người dùng</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<string> UnSubscriberAsync(
        int topicRelationId,
        CancellationToken cancellationToken = default);
}
