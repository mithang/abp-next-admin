using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Models.Search;
using LINGYUN.Abp.OpenObserve.Utils;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Tìm kiếm
    /// </summary>
    /// <remarks>
    /// POST /api/{organization}/_search
    /// Tham khảo: https://openobserve.ai/docs/reference/api/search/
    /// </remarks>
    /// <typeparam name="THint">Cấu trúc dữ liệu trúng khớp</typeparam>
    /// <param name="organization">Khi không chỉ định sẽ dùng AbpOpenObserveOptions.Organization</param>
    /// <param name="query">Điều kiện truy vấn, khoảng thời gian tính bằng micro giây, bắt buộc</param>
    /// <param name="searchType">Nguồn tìm kiếm (ui/dashboards/reports/alerts, v.v.)</param>
    /// <param name="timeout">Thời gian chờ (giây), mặc định là 30</param>
    /// <param name="agentOptions">Tùy chọn client agent/MCP</param>
    /// <param name="useCache">Có sử dụng bộ nhớ đệm kết quả hay không, khi bỏ qua sẽ do phía máy chủ quyết định (mặc định là true)</param>
    /// <param name="clearCache">Có xóa bộ nhớ đệm kết quả hay không, khi là true sẽ bắt buộc không dùng bộ nhớ đệm</param>
    public async virtual Task<SearchResponse<THint>> SearchAsync<THint>(
        string? organization,
        SearchQuery query,
        SearchType? searchType = null,
        int? timeout = OpenObserveConstants.ZO_QUERY_TIMEOUT,
        SearchAgentOptions? agentOptions = null,
        bool? useCache = null,
        bool? clearCache = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = OpenObserveQueryString.Build(
            ("use_cache", useCache),
            ("clear_cache", clearCache));

        var requestUri = $"/api/{ResolveOrganization(organization)}/_search{queryString}";

        var response = await PostJsonAsync<SearchRequest, SearchResponse<THint>>(
            requestUri,
            new SearchRequest(query, searchType, timeout, agentOptions),
            ThrowIfSearchException,
            cancellationToken);

        return response!;
    }

    /// <summary>
    /// Tìm kiếm
    /// </summary>
    /// <remarks>
    /// POST /api/{organization}/_search, sử dụng AbpOpenObserveOptions.Organization
    /// </remarks>
    public async virtual Task<SearchResponse<THint>> SearchAsync<THint>(
        SearchQuery query,
        SearchType? searchType = null,
        int? timeout = OpenObserveConstants.ZO_QUERY_TIMEOUT,
        SearchAgentOptions? agentOptions = null,
        bool? useCache = null,
        bool? clearCache = null,
        CancellationToken cancellationToken = default)
    {
        return await SearchAsync<THint>(
            null,
            query,
            searchType,
            timeout,
            agentOptions,
            useCache,
            clearCache,
            cancellationToken);
    }

    protected virtual Func<Models.OpenObserveErrorResponse, HttpResponseMessage, Exception> ThrowIfSearchException
    {
        get
        {
            return (errorResponse, httpResponse) => new OpenObserveSearchException(
                errorResponse,
                (int)httpResponse.StatusCode);
        }
    }
}
