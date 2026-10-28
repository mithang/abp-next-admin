using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Models.Ingestion;
using System.Net.Http.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Thu thập nhật ký - JSON
    /// </summary>
    /// <remarks>
    /// POST /api/{organization}/{stream}/_json
    /// Thân yêu cầu là mảng JSON: [ {..}, {..} ]
    /// Phản hồi: {"code":200,"status":[{"name":"stream1","successful":2,"failed":0}]}
    /// Tham khảo: https://openobserve.ai/docs/reference/api/ingestion/logs/json/
    /// </remarks>
    public async virtual Task<JsonResponse> JsonRequestAsync<TData>(
        string? organization,
        string stream,
        IEnumerable<TData> datas,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/{Uri.EscapeDataString(stream)}/_json";

        var httpResponse = await HttpClient.PostAsync(requestUri, CreateJsonContent(datas), cancellationToken);

        await EnsureSuccessStatusCode(httpResponse, ThrowIfIngestionException(stream), cancellationToken);

        var responseContent = await httpResponse.Content.ReadAsStringAsync(cancellationToken);

        return DeserializeOrDefault<JsonResponse>(responseContent)!;
    }

    /// <summary>
    /// Thu thập nhật ký - JSON (một bản ghi)
    /// </summary>
    /// <remarks>
    /// Một bản ghi dùng tên phương thức riêng, tránh gây mơ hồ khi nạp chồng với <see cref="JsonRequestAsync{TData}(string?, string, IEnumerable{TData}, CancellationToken)"/>
    /// (Khi truyền vào một mảng, phương thức nạp chồng đơn bản ghi dạng generic sẽ được ưu tiên khớp, khiến thân yêu cầu bị bọc thêm một lớp mảng)
    /// </remarks>
    public async virtual Task<JsonResponse> JsonRecordAsync<TData>(
        string? organization,
        string stream,
        TData data,
        CancellationToken cancellationToken = default)
    {
        return await JsonRequestAsync(organization, stream, [data], cancellationToken);
    }

    /// <summary>
    /// Thu thập nhật ký - Bulk
    /// </summary>
    /// <remarks>
    /// POST /api/{organization}/_bulk
    /// Thân yêu cầu là NDJSON, cứ hai dòng thành một nhóm: dòng đầu là dòng hành động {"index":{"_index":"stream1"}}, dòng thứ hai là dữ liệu bản ghi
    /// Phản hồi có cấu trúc tương thích với _bulk của Elasticsearch: {"took":0,"errors":false,"items":[{"index":{...}}]}
    /// Tham khảo: https://openobserve.ai/docs/reference/api/ingestion/logs/bulk/
    /// </remarks>
    /// <param name="action">Hành động: index / create / update, mặc định là index</param>
    public async virtual Task<JsonBulkResponse> JsonBulkAsync<TData>(
        string? organization,
        string stream,
        IEnumerable<TData> datas,
        string action = OpenObserveConstants.BulkActions.Index,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/_bulk";

        var builder = new StringBuilder();
        foreach (var data in datas)
        {
            // Dòng hành động: {"index":{"_index":"stream1"}}
            builder.AppendLine(Serializer.Serialize(
                new Dictionary<string, JsonBulkRequest>
                {
                    [action] = new JsonBulkRequest { Index = stream },
                }));
            // Dòng dữ liệu bản ghi
            builder.AppendLine(Serializer.Serialize(data));
        }

        using var content = new StringContent(builder.ToString(), Encoding.UTF8, OpenObserveConstants.NdJsonContentType);

        var httpResponse = await HttpClient.PostAsync(requestUri, content, cancellationToken);

        await EnsureSuccessStatusCode(httpResponse, ThrowIfIngestionException(stream), cancellationToken);

        var responseContent = await httpResponse.Content.ReadAsStringAsync(cancellationToken);

        return DeserializeOrDefault<JsonBulkResponse>(responseContent)!;
    }

    /// <summary>
    /// Thu thập nhật ký - Multi
    /// </summary>
    /// <remarks>
    /// POST /api/{organization}/{stream}/_multi
    /// Thân yêu cầu là NDJSON, mỗi dòng là một đối tượng bản ghi (không có dòng hành động)
    /// Phản hồi giống với _json: {"code":200,"status":[{"name":"stream1","successful":2,"failed":0}]}
    /// Tham khảo: https://openobserve.ai/docs/reference/api/ingestion/logs/multi/
    /// </remarks>
    public async virtual Task<JsonResponse> JsonMultiAsync<TData>(
        string? organization,
        string stream,
        IEnumerable<TData> datas,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/{Uri.EscapeDataString(stream)}/_multi";

        var builder = new StringBuilder();
        foreach (var data in datas)
        {
            builder.AppendLine(Serializer.Serialize(data));
        }

        using var content = new StringContent(builder.ToString(), Encoding.UTF8, OpenObserveConstants.NdJsonContentType);

        var httpResponse = await HttpClient.PostAsync(requestUri, content, cancellationToken);

        await EnsureSuccessStatusCode(httpResponse, ThrowIfIngestionException(stream), cancellationToken);

        var responseContent = await httpResponse.Content.ReadAsStringAsync(cancellationToken);

        return DeserializeOrDefault<JsonResponse>(responseContent)!;
    }

    /// <summary>
    /// Tạo ngoại lệ khi thu thập thất bại
    /// </summary>
    protected virtual Func<OpenObserveErrorResponse, HttpResponseMessage, Exception> ThrowIfIngestionException(string stream)
    {
        return (errorResponse, httpResponse) => new OpenObserveIngestionException(
            stream,
            errorResponse,
            (int)httpResponse.StatusCode);
    }
}
