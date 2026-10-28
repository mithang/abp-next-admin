using System;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Công cụ dấu thời gian OpenObserve
/// </summary>
public static class OpenObserveTimestampHelper
{
    /// <summary>
    /// Chuyển đổi thành dấu thời gian micro giây
    /// </summary>
    public static long ToMicroseconds(DateTime time)
    {
        return new DateTimeOffset(time.ToUniversalTime()).ToUnixTimeMilliseconds() * 1000L;
    }

    /// <summary>
    /// Thử ghi đè <c>_timestamp</c> bằng thời gian của nhật ký
    /// </summary>
    /// <remarks>
    /// OpenObserve mặc định chỉ cho phép ghi dữ liệu trong vòng <c>ZO_INGEST_ALLOWED_UPTO</c> (mặc định là 5) giờ,
    /// dữ liệu vượt quá cửa sổ này sẽ bị máy chủ loại bỏ, vì vậy khi vượt quá sẽ trả về null để máy chủ dùng thời gian ghi
    /// </remarks>
    /// <param name="time">Thời gian nghiệp vụ của chính nhật ký (ví dụ AuditLog.ExecutionTime / SecurityLog.CreationTime)</param>
    /// <param name="now">Thời gian hiện tại</param>
    /// <param name="allowedUptoHours">Số giờ được phép truy hồi, cần khớp với ZO_INGEST_ALLOWED_UPTO của máy chủ</param>
    public static long? TryGetTimestamp(DateTime time, DateTime now, int allowedUptoHours)
    {
        if (time == default)
        {
            return null;
        }

        if (allowedUptoHours > 0 && time.ToUniversalTime() < now.ToUniversalTime().AddHours(-allowedUptoHours))
        {
            return null;
        }

        return ToMicroseconds(time);
    }
}
