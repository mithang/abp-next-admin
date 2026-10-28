using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Models.Stream;
using LINGYUN.Abp.OpenObserve.Utils;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Liệt kê luồng dữ liệu
    /// </summary>
    /// <remarks>
    /// GET /api/{organization}/streams
    /// Tham khảo: https://openobserve.ai/docs/reference/api/stream/list/
    /// </remarks>
    /// <param name="fetchSchema">Có trả về định nghĩa trường của từng luồng dữ liệu hay không</param>
    /// <param name="type">Loại luồng dữ liệu, mặc định là logs</param>
    public async virtual Task<StreamListResponse> GetStreamsAsync(
        string? organization = null,
        bool? fetchSchema = null,
        StreamType? type = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("fetchSchema", fetchSchema),
            ("type", type?.AsString()));

        var requestUri = $"/api/{ResolveOrganization(organization)}/streams{queryString}";

        return (await GetAsync<StreamListResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Lấy định nghĩa trường của luồng dữ liệu
    /// </summary>
    /// <remarks>
    /// GET /api/{organization}/streams/{stream}/schema
    /// Tham khảo: https://openobserve.ai/docs/reference/api/stream/schema/
    /// </remarks>
    public async virtual Task<StreamInfo> GetStreamSchemaAsync(
        string stream,
        string? organization = null,
        StreamType? type = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(("type", type?.AsString()));

        var requestUri = $"/api/{ResolveOrganization(organization)}/streams/{Uri.EscapeDataString(stream)}/schema{queryString}";

        return (await GetAsync<StreamInfo>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Tạo cài đặt luồng dữ liệu
    /// </summary>
    /// <remarks>
    /// POST /api/{org_id}/streams/{stream_name}/settings
    /// Tham khảo: https://openobserve.ai/docs/reference/api/stream/setting/
    /// </remarks>
    /// <param name="partitionKeys">Trường phân vùng</param>
    /// <param name="indexFields">Trường chỉ mục cấp hai</param>
    /// <param name="fullTextSearchKeys">Trường tìm kiếm toàn văn</param>
    /// <param name="bloomFilterFields">Trường bộ lọc Bloom</param>
    /// <param name="dataRetention">Số ngày lưu giữ dữ liệu, tối thiểu 3 ngày</param>
    /// <param name="flattenLevel">Cấp độ làm phẳng</param>
    /// <param name="definedSchemaFields">Các trường schema tùy chỉnh được giữ lại</param>
    /// <param name="maxQueryRange">Phạm vi thời gian tối đa cho một lần truy vấn (giờ)</param>
    /// <param name="storeOriginalData">Có lưu trữ dữ liệu gốc hay không</param>
    /// <param name="approxPartition">Có sử dụng phân vùng theo phạm vi thời gian chia đều hay không</param>
    /// <param name="extendedRetentionDays">Phạm vi thời gian kéo dài thời hạn lưu giữ</param>
    /// <param name="indexOriginalData">Có lập chỉ mục toàn văn cho thân nhật ký gốc hay không</param>
    /// <param name="indexAllValues">Có lập chỉ mục khớp chính xác cho tất cả các trường hay không</param>
    /// <param name="storageType">Loại lưu trữ: normal (mặc định) / compliance</param>
    public async virtual Task<OpenObserveCodeMessageResponse> CreateStreamSettingsAsync(
        string stream,
        string[]? partitionKeys = null,
        string[]? indexFields = null,
        string[]? fullTextSearchKeys = null,
        string[]? bloomFilterFields = null,
        int? dataRetention = null,
        int? flattenLevel = null,
        string[]? definedSchemaFields = null,
        int? maxQueryRange = null,
        bool? storeOriginalData = null,
        bool? approxPartition = null,
        object[]? extendedRetentionDays = null,
        bool? indexOriginalData = null,
        bool? indexAllValues = null,
        string? storageType = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/streams/{Uri.EscapeDataString(stream)}/settings";

        var request = new StreamSettingRequest
        {
            PartitionKeys = partitionKeys,
            IndexFields = indexFields,
            FullTextSearchKeys = fullTextSearchKeys,
            BloomFilterFields = bloomFilterFields,
            DataRetention = dataRetention,
            FlattenLevel = flattenLevel,
            DefinedSchemaFields = definedSchemaFields,
            MaxQueryRange = maxQueryRange,
            StoreOriginalData = storeOriginalData,
            ApproxPartition = approxPartition,
            ExtendedRetentionDays = extendedRetentionDays,
            IndexOriginalData = indexOriginalData,
            IndexAllValues = indexAllValues,
            StorageType = storageType,
        };

        return (await PostJsonAsync<StreamSettingRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Cập nhật cài đặt luồng dữ liệu
    /// </summary>
    /// <remarks>
    /// PUT /api/{org_id}/streams/{stream_name}/settings
    /// Các trường hỗ trợ add/set/remove được truyền bằng <see cref="UpdateStreamSettingValue{T}"/>
    /// Tham khảo: https://openobserve.ai/docs/reference/api/stream/setting/
    /// </remarks>
    public async virtual Task<OpenObserveCodeMessageResponse> UpdateStreamSettingsAsync(
        string stream,
        UpdateStreamSettingValue<string>? partitionKeys = null,
        UpdateStreamSettingValue<string>? indexFields = null,
        UpdateStreamSettingValue<string>? fullTextSearchKeys = null,
        UpdateStreamSettingValue<string>? bloomFilterFields = null,
        UpdateStreamSettingValue<string>? definedSchemaFields = null,
        UpdateStreamSettingValue<object>? extendedRetentionDays = null,
        int? dataRetention = null,
        int? flattenLevel = null,
        int? maxQueryRange = null,
        bool? storeOriginalData = null,
        bool? approxPartition = null,
        bool? indexOriginalData = null,
        bool? indexAllValues = null,
        string? storageType = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/streams/{Uri.EscapeDataString(stream)}/settings";

        var request = new UpdateStreamSettingRequest
        {
            PartitionKeys = partitionKeys,
            IndexFields = indexFields,
            FullTextSearchKeys = fullTextSearchKeys,
            BloomFilterFields = bloomFilterFields,
            DefinedSchemaFields = definedSchemaFields,
            ExtendedRetentionDays = extendedRetentionDays,
            DataRetention = dataRetention,
            FlattenLevel = flattenLevel,
            MaxQueryRange = maxQueryRange,
            StoreOriginalData = storeOriginalData,
            ApproxPartition = approxPartition,
            IndexOriginalData = indexOriginalData,
            IndexAllValues = indexAllValues,
            StorageType = storageType,
        };

        return (await PutJsonAsync<UpdateStreamSettingRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Xóa luồng dữ liệu
    /// </summary>
    /// <remarks>
    /// DELETE /api/{org_id}/streams/{stream_name}?type=logs&amp;delete_all=true
    /// Việc xóa là không đồng bộ(Compactor thăm dò mỗi 10 phút), và không thể khôi phục
    /// Tham khảo: https://openobserve.ai/docs/reference/api/stream/delete/
    /// </remarks>
    /// <param name="deleteAll">Có đồng thời xóa các cảnh báo và bảng điều khiển liên quan hay không</param>
    public async virtual Task<OpenObserveCodeMessageResponse> DeleteStreamAsync(
        string stream,
        StreamType type = StreamType.Logs,
        bool deleteAll = false,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("type", type.AsString()),
            ("delete_all", deleteAll));

        var requestUri = $"/api/{ResolveOrganization(organization)}/streams/{Uri.EscapeDataString(stream)}{queryString}";

        return (await DeleteAsync<OpenObserveCodeMessageResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Xóa dữ liệu theo phạm vi thời gian
    /// </summary>
    /// <remarks>
    /// DELETE /api/{org_id}/streams/{stream_name}/data_by_time_range?start=..&amp;end=..
    /// Nhật ký bị xóa theo giờ, dấu vết bị xóa theo ngày
    /// </remarks>
    /// <param name="startTime">Thời gian bắt đầu (bao gồm)</param>
    /// <param name="endTime">Thời gian kết thúc (bao gồm)</param>
    public async virtual Task<StreamDeleteJobResponse> DeleteStreamDataByTimeRangeAsync(
        string stream,
        DateTime startTime,
        DateTime endTime,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("start", startTime.ToMicroseconds()),
            ("end", endTime.ToMicroseconds()));

        var requestUri = $"/api/{ResolveOrganization(organization)}/streams/{Uri.EscapeDataString(stream)}/data_by_time_range{queryString}";

        return (await DeleteAsync<StreamDeleteJobResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Truy vấn trạng thái tác vụ xóa dữ liệu theo phạm vi thời gian
    /// </summary>
    /// <remarks>
    /// GET /api/{org_id}/streams/{stream_name}/data_by_time_range/status/{id}
    /// </remarks>
    public async virtual Task<StreamDeleteJobStatusResponse> GetStreamDataByTimeRangeStatusAsync(
        string stream,
        string id,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/streams/{Uri.EscapeDataString(stream)}/data_by_time_range/status/{Uri.EscapeDataString(id)}";

        return (await GetAsync<StreamDeleteJobStatusResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Xóa bộ nhớ đệm kết quả của luồng dữ liệu
    /// </summary>
    /// <remarks>
    /// DELETE /api/{org_id}/streams/{stream_name}/cache/results?type=..&amp;ts=..
    /// Xóa bộ nhớ đệm trước ts, bộ nhớ đệm từ ts trở đi (bao gồm) được giữ lại
    /// </remarks>
    /// <param name="stream">Tên luồng dữ liệu; khi truyền _all sẽ xóa bộ nhớ đệm của tất cả các luồng dữ liệu</param>
    /// <param name="timestamp">Ngưỡng thời gian</param>
    public async virtual Task<OpenObserveCodeMessageResponse> DeleteStreamCacheAsync(
        string stream,
        StreamType type,
        DateTime timestamp,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("type", type.AsString()),
            ("ts", timestamp.ToMicroseconds()));

        var requestUri = $"/api/{ResolveOrganization(organization)}/streams/{Uri.EscapeDataString(stream)}/cache/results{queryString}";

        return (await DeleteAsync<OpenObserveCodeMessageResponse>(requestUri, cancellationToken: cancellationToken))!;
    }
}
