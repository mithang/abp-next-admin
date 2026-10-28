using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.OpenObserve.Models.Search;

/// <summary>
/// Phản hồi tìm kiếm
/// </summary>
/// <remarks>
/// Tham khảo: https://openobserve.ai/docs/reference/api/search/
/// </remarks>
public class SearchResponse<THit>
{
    /// <summary>
    /// Dữ liệu kết quả khớp
    /// </summary>
    /// <remarks>
    /// Mỗi bản ghi là dòng gốc lúc thu thập, kèm theo _timestamp (micro giây) và _p
    /// </remarks>
    [JsonPropertyName("hits")]
    public THit[] Hits { get; set; } = [];

    /// <summary>
    /// Tổng số kết quả khớp
    /// </summary>
    [JsonPropertyName("total")]
    public long Total { get; set; }

    /// <summary>
    /// Độ lệch
    /// </summary>
    /// <remarks>
    /// Lấy từ query.from
    /// </remarks>
    [JsonPropertyName("from")]
    public long From { get; set; }

    /// <summary>
    /// Số lượng
    /// </summary>
    /// <remarks>
    /// Lấy từ query.size
    /// </remarks>
    [JsonPropertyName("size")]
    public long Size { get; set; }

    /// <summary>
    /// Thời gian truy vấn
    /// </summary>
    /// <remarks>
    /// Đơn vị: mili giây
    /// </remarks>
    [JsonPropertyName("took")]
    public long Took { get; set; }

    /// <summary>
    /// Chi tiết thời gian
    /// </summary>
    [JsonPropertyName("took_detail")]
    public SearchTookDetail? TookDetail { get; set; }

    /// <summary>
    /// Khối lượng dữ liệu đã quét
    /// </summary>
    /// <remarks>
    /// Đơn vị: MB
    /// </remarks>
    [JsonPropertyName("scan_size")]
    public long ScanSize { get; set; }

    /// <summary>
    /// Số bản ghi đã quét
    /// </summary>
    [JsonPropertyName("scan_records")]
    public long ScanRecords { get; set; }

    /// <summary>
    /// Tỷ lệ trúng bộ nhớ đệm
    /// </summary>
    [JsonPropertyName("result_cache_ratio")]
    public int? ResultCacheRatio { get; set; }

    /// <summary>
    /// Các cột trả về
    /// </summary>
    [JsonPropertyName("columns")]
    public string[]? Columns { get; set; }

    /// <summary>
    /// Định danh liên kết
    /// </summary>
    [JsonPropertyName("trace_id")]
    public string? TraceId { get; set; }

    /// <summary>
    /// Lỗi thực thi hàm
    /// </summary>
    [JsonPropertyName("function_error")]
    public string[]? FunctionError { get; set; }

    /// <summary>
    /// Có phải dữ liệu một phần hay không
    /// </summary>
    /// <remarks>
    /// Khi là true, phản hồi dựa trên dữ liệu một phần
    /// </remarks>
    [JsonPropertyName("is_partial")]
    public bool IsPartial { get; set; }

    /// <summary>
    /// Khoảng biểu đồ histogram (giây)
    /// </summary>
    [JsonPropertyName("histogram_interval")]
    public long? HistogramInterval { get; set; }

    /// <summary>
    /// Thời gian bắt đầu sau khi phía máy chủ điều chỉnh (micro giây)
    /// </summary>
    /// <remarks>
    /// Phạm vi thời gian sẽ được điều chỉnh khi bị giới hạn max_query_range của luồng dữ liệu
    /// </remarks>
    [JsonPropertyName("new_start_time")]
    public long? NewStartTime { get; set; }

    /// <summary>
    /// Thời gian kết thúc sau khi phía máy chủ điều chỉnh (micro giây)
    /// </summary>
    [JsonPropertyName("new_end_time")]
    public long? NewEndTime { get; set; }

    /// <summary>
    /// Hướng sắp xếp
    /// </summary>
    /// <remarks>
    /// asc / desc
    /// </remarks>
    [JsonPropertyName("order_by")]
    public string? OrderBy { get; set; }

    /// <summary>
    /// Siêu dữ liệu sắp xếp
    /// </summary>
    [JsonPropertyName("order_by_metadata")]
    public string[][]? OrderByMetadata { get; set; }

    /// <summary>
    /// Loại phản hồi
    /// </summary>
    [JsonPropertyName("response_type")]
    public string? ResponseType { get; set; }

    /// <summary>
    /// Định dạng kết quả
    /// </summary>
    /// <remarks>
    /// Trả về khi agent_options.output_format là csv/md_table, ví dụ csv / md_table / ndjson
    /// </remarks>
    [JsonPropertyName("format")]
    public string? Format { get; set; }

    /// <summary>
    /// Kết quả đã định dạng
    /// </summary>
    /// <remarks>
    /// Khi agent_options.output_format là csv/md_table, hits rỗng và dữ liệu nằm trong trường này
    /// </remarks>
    [JsonPropertyName("data")]
    public string? Data { get; set; }

    /// <summary>
    /// Thông tin gợi ý
    /// </summary>
    [JsonPropertyName("advisory")]
    public string? Advisory { get; set; }

    /// <summary>
    /// Các trường không được khai báo trong mô hình
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, JsonElement>? ExtraProperties { get; set; }
}
