using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WxPusher.User;
/// <summary>
/// Giao diện người dùng
/// </summary>
public interface IWxPusherUserProvider
{
    /// <summary>
    /// Truy vấn người dùng theo dõi App V2
    /// </summary>
    /// <remarks>
    /// Lấy thông tin của tất cả người dùng WeChat theo dõi ứng dụng/chủ đề. Lưu ý, một người dùng WeChat nếu đồng thời theo dõi ứng dụng, chủ đề, thậm chí nhiều chủ đề, sẽ trả về nhiều bản ghi.
    /// </remarks>
    /// <param name="page">Số trang của dữ liệu được yêu cầu</param>
    /// <param name="pageSize">Kích thước phân trang, không được vượt quá 100</param>
    /// <param name="uid">uid của người dùng, tùy chọn, nếu không truyền thì truy vấn tất cả người dùng, truyền uid thì truy vấn thông tin của một người dùng cụ thể.</param>
    /// <param name="isBlock">Truy vấn người dùng bị chặn, tùy chọn, không truyền thì truy vấn tất cả người dùng, true truy vấn người dùng bị chặn, false truy vấn người dùng không bị chặn</param>
    /// <param name="type">Loại theo dõi, tùy chọn, không truyền thì truy vấn tất cả người dùng, 0 là ứng dụng, 1 là chủ đề</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<WxPusherPagedResult<UserProfile>> GetUserListAsync(
        int page = 1,
        int pageSize = 10,
        string? uid = null,
        bool? isBlock = null,
        FlowType? type = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Xóa người dùng
    /// </summary>
    /// <remarks>
    /// Bạn có thể xóa lượt theo dõi ứng dụng, chủ đề của người dùng, sau khi xóa, người dùng có thể theo dõi lại, nếu muốn người dùng theo dõi lại, có thể gọi giao diện chặn để chặn người dùng.
    /// </remarks>
    /// <param name="id">id người dùng, có thể lấy qua giao diện truy vấn người dùng</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> DeleteUserAsync(
        int id,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Chặn người dùng
    /// </summary>
    /// <remarks>
    /// Sau khi chặn thì không thể gửi tin nhắn nữa, người dùng cũng không thể theo dõi lại, trừ khi bạn hủy chặn đối với người đó. Khi gọi giao diện chặn thì không cần gọi thêm giao diện xóa.
    /// </remarks>
    /// <param name="id">id người dùng, có thể lấy qua giao diện truy vấn người dùng</param>
    /// <param name="reject">Có chặn hay không, true nghĩa là chặn, false nghĩa là hủy chặn</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> RejectUserAsync(
        int id,
        bool reject,
        CancellationToken cancellationToken = default);
}
