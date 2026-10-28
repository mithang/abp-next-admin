using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.PushPlus.Message;

public interface IPushPlusMessageProvider
{
    /// <summary>
    /// Truy vấn kết quả gửi tin nhắn
    /// </summary>
    /// <param name="shortCode">Mã liên kết rút gọn của tin nhắn</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<SendPushPlusMessageResult> GetSendResultAsync(
        string shortCode,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Danh sách tin nhắn
    /// </summary>
    /// <param name="current">Số trang hiện tại</param>
    /// <param name="pageSize">Kích thước mỗi trang, giá trị tối đa là 50</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<PushPlusPagedResponse<PushPlusMessage>> GetMessageListAsync(
        int current,
        int pageSize,
        CancellationToken cancellationToken = default); 
}
