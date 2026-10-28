using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Models.Function;
using System;
using System.Text.Json.Nodes;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    /// <summary>
    /// Tạo hàm
    /// </summary>
    /// <remarks>
    /// POST /api/{organization}/functions
    /// Tham khảo: https://openobserve.ai/docs/reference/api/function/
    /// </remarks>
    /// <param name="name">Tên hàm</param>
    /// <param name="function">Thân hàm</param>
    /// <param name="transType">Ngôn ngữ hàm: 0 = VRL, 1 = JavaScript</param>
    /// <param name="streams">Luồng dữ liệu mà hàm có hiệu lực</param>
    /// <param name="order">Thứ tự thực thi (trường ví dụ trong tài liệu, hiện tại chưa sử dụng)</param>
    public async virtual Task<OpenObserveCodeMessageResponse> CreateFunctionAsync(
        string name,
        string function,
        string? functionParams = null,
        int? numArgs = null,
        FunctionTransType? transType = null,
        FunctionStreamInfo[]? streams = null,
        int? order = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/functions";

        var request = new SaveFunctionRequest
        {
            Name = name,
            Function = function,
            Params = functionParams,
            NumArgs = numArgs,
            TransType = transType,
            Streams = streams,
            Order = order,
        };

        return (await PostJsonAsync<SaveFunctionRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Cập nhật hàm
    /// </summary>
    /// <remarks>
    /// PUT /api/{organization}/functions/{name}
    /// Tham khảo: https://openobserve.ai/docs/reference/api/function/
    /// </remarks>
    public async virtual Task<OpenObserveCodeMessageResponse> UpdateFunctionAsync(
        string name,
        string function,
        string? functionParams = null,
        int? numArgs = null,
        FunctionTransType? transType = null,
        FunctionStreamInfo[]? streams = null,
        int? order = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/functions/{Uri.EscapeDataString(name)}";

        var request = new SaveFunctionRequest
        {
            Name = name,
            Function = function,
            Params = functionParams,
            NumArgs = numArgs,
            TransType = transType,
            Streams = streams,
            Order = order,
        };

        return (await PutJsonAsync<SaveFunctionRequest, OpenObserveCodeMessageResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Xóa hàm
    /// </summary>
    /// <remarks>
    /// DELETE /api/{organization}/functions/{name}
    /// Trả về 409 khi pipeline phụ thuộc vào hàm này
    /// Tham khảo: https://openobserve.ai/docs/reference/api/function/
    /// </remarks>
    /// <param name="force">Triển khai khai báo tham số này để xóa bắt buộc, phiên bản máy chủ hiện tại chưa sử dụng</param>
    public async virtual Task<OpenObserveCodeMessageResponse> DeleteFunctionAsync(
        string name,
        bool? force = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var queryString = Utils.OpenObserveQueryString.Build(("force", force));

        var requestUri = $"/api/{ResolveOrganization(organization)}/functions/{Uri.EscapeDataString(name)}{queryString}";

        return (await DeleteAsync<OpenObserveCodeMessageResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Liệt kê hàm
    /// </summary>
    /// <remarks>
    /// GET /api/{organization}/functions
    /// Tham khảo: https://openobserve.ai/docs/reference/api/function/
    /// </remarks>
    public async virtual Task<FunctionListResponse> GetFunctionsAsync(
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/functions";

        return (await GetAsync<FunctionListResponse>(requestUri, cancellationToken: cancellationToken))!;
    }

    /// <summary>
    /// Kiểm thử hàm
    /// </summary>
    /// <remarks>
    /// POST /api/{org_id}/functions/test
    /// Lưu ý: Giao diện này không xuất hiện trong tài liệu API, lấy từ mã nguồn triển khai
    /// </remarks>
    /// <param name="function">Thân hàm</param>
    /// <param name="events">Dữ liệu mẫu dùng để kiểm thử</param>
    /// <param name="transType">Ngôn ngữ hàm, nếu không truyền thì máy chủ tự động nhận diện</param>
    public async virtual Task<TestFunctionResponse> TestFunctionAsync(
        string function,
        JsonNode[] events,
        FunctionTransType? transType = null,
        string? organization = null,
        CancellationToken cancellationToken = default)
    {
        var requestUri = $"/api/{ResolveOrganization(organization)}/functions/test";

        var request = new TestFunctionRequest
        {
            Function = function,
            Events = events,
            TransType = transType,
        };

        return (await PostJsonAsync<TestFunctionRequest, TestFunctionResponse>(
            requestUri,
            request,
            cancellationToken: cancellationToken))!;
    }
}
