using System;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Search;

/// <summary>
/// Điều kiện truy vấn tìm kiếm
/// </summary>
public class SearchQuery
{
    /// <summary>
    /// Câu lệnh truy vấn SQL
    /// </summary>
    /// <remarks>
    /// Dùng SQL để lọc dữ liệu, mặc định sắp xếp theo _timestamp, có thể ghi đè bằng order by,
    /// Dùng from/size để phân trang
    /// </remarks>
    [JsonPropertyName("sql")]
    public string Sql { get; set; }

    /// <summary>
    /// Thời gian bắt đầu (micro giây)
    /// </summary>
    /// <remarks>
    /// Bắt buộc phải cung cấp, nếu không sẽ quét toàn bộ
    /// </remarks>
    [JsonPropertyName("start_time")]
    public long StartTime { get; set; }

    /// <summary>
    /// Thời gian kết thúc (micro giây)
    /// </summary>
    [JsonPropertyName("end_time")]
    public long EndTime { get; set; }

    /// <summary>
    /// Độ lệch
    /// </summary>
    [JsonPropertyName("from")]
    public long From { get; set; }

    /// <summary>
    /// Số bản ghi trả về
    /// </summary>
    [JsonPropertyName("size")]
    public long Size { get; set; }

    /// <summary>
    /// Chế độ nhanh
    /// </summary>
    /// <remarks>
    /// Chỉ quét Interesting Fields, cần phía máy chủ bật ZO_QUICK_MODE_ENABLED
    /// </remarks>
    [JsonPropertyName("quick_mode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool QuickMode { get; set; }

    /// <summary>
    /// Nhãn loại truy vấn
    /// </summary>
    [JsonPropertyName("query_type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? QueryType { get; set; }

    /// <summary>
    /// Có thống kê tổng số kết quả trúng hay không
    /// </summary>
    [JsonPropertyName("track_total_hits")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool TrackTotalHits { get; set; }

    /// <summary>
    /// Có sử dụng hàm hay không
    /// </summary>
    [JsonPropertyName("uses_zo_fn")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool UsesZoFn { get; set; }

    /// <summary>
    /// Tên hàm áp dụng cho kết quả (VRL/JS)
    /// </summary>
    [JsonPropertyName("query_fn")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? QueryFn { get; set; }

    /// <summary>
    /// Có bỏ qua WAL hay không
    /// </summary>
    [JsonPropertyName("skip_wal")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool SkipWal { get; set; }

    /// <summary>
    /// Có xuất dạng luồng hay không
    /// </summary>
    [JsonPropertyName("streaming_output")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool StreamingOutput { get; set; }

    /// <summary>
    /// Định danh luồng
    /// </summary>
    [JsonPropertyName("streaming_id")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? StreamingId { get; set; }

    /// <summary>
    /// Khoảng biểu đồ tần suất (giây)
    /// </summary>
    [JsonPropertyName("histogram_interval")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public long HistogramInterval { get; set; }

    /// <summary>
    /// Múi giờ
    /// </summary>
    /// <remarks>
    /// Độ lệch cố định, ví dụ +08:00, áp dụng cho việc chia bucket của histogram() khi không chỉ định tham số thứ ba
    /// </remarks>
    [JsonPropertyName("timezone")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Timezone { get; set; }

    public SearchQuery(
        string sql,
        DateTime startTime,
        DateTime endTime,
        long from = 0,
        long size = 10)
    {
        Sql = sql;
        StartTime = startTime.ToMicroseconds();
        EndTime = endTime.ToMicroseconds();
        From = from;
        Size = size;
    }

    /// <summary>
    /// Đặt khoảng thời gian
    /// </summary>
    public virtual SearchQuery WithTimeRange(DateTime startTime, DateTime endTime)
    {
        StartTime = startTime.ToMicroseconds();
        EndTime = endTime.ToMicroseconds();

        return this;
    }

    /// <summary>
    /// Đặt phân trang
    /// </summary>
    public virtual SearchQuery WithPaging(long from, long size)
    {
        From = from;
        Size = size;

        return this;
    }
}
