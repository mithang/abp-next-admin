using LINGYUN.Abp.OpenObserve.Models;
using LINGYUN.Abp.OpenObserve.Serialization;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LINGYUN.Abp.OpenObserve;

public partial class OpenObserveClient
{
    protected HttpClient HttpClient { get; }
    protected IOpenObserveSerializer Serializer { get; }
    protected AbpOpenObserveOptions Options { get; }

    public OpenObserveClient(
        HttpClient httpClient,
        IOpenObserveSerializer serializer,
        IOptions<AbpOpenObserveOptions> options)
    {
        HttpClient = httpClient;
        Serializer = serializer;
        Options = options.Value;
    }

    /// <summary>
    /// Phân tích tên tổ chức
    /// </summary>
    /// <param name="organization">Khi không chỉ định sẽ dùng AbpOpenObserveOptions.Organization</param>
    protected virtual string ResolveOrganization(string? organization = null)
    {
        return !organization.IsNullOrWhiteSpace() ? organization! : Options.Organization;
    }

    /// <summary>
    /// Tạo nội dung yêu cầu JSON
    /// </summary>
    protected virtual StringContent CreateJsonContent<T>(T value)
    {
        return new StringContent(
            Serializer.Serialize(value),
            Encoding.UTF8,
            OpenObserveConstants.JsonContentType);
    }

    /// <summary>
    /// Thử phân tích phản hồi lỗi
    /// </summary>
    /// <remarks>
    /// Khi thân phản hồi không phải cấu trúc lỗi chuẩn thì trả về null, phía gọi sẽ ném <see cref="OpenObserveRequestException"/>
    /// </remarks>
    protected virtual OpenObserveErrorResponse? TryDeserializeErrorResponse(string? responseContent)
    {
        if (responseContent.IsNullOrWhiteSpace())
        {
            return null;
        }

        return Serializer.TryDeserialize<OpenObserveErrorResponse>(responseContent, out var errorResponse)
            ? errorResponse
            : null;
    }

    /// <summary>
    /// Xử lý phản hồi lỗi thống nhất của OpenObserve
    /// </summary>
    /// <remarks>
    /// Thân phản hồi 4xx/5xx là cấu trúc lỗi chuẩn của OpenObserve: {"code":..,"message":..,"error_detail":..,"hint":..,"suggestions":[..]}
    /// </remarks>
    protected async virtual Task<HttpResponseMessage> EnsureSuccessStatusCode(
        HttpResponseMessage httpResponse,
        Func<OpenObserveErrorResponse, HttpResponseMessage, Exception>? exceptionFactory = null,
        CancellationToken cancellationToken = default)
    {
        if (httpResponse.IsSuccessStatusCode)
        {
            return httpResponse;
        }

        var responseContent = await httpResponse.Content.ReadAsStringAsync(cancellationToken);
        var errorResponse = TryDeserializeErrorResponse(responseContent);

        if (errorResponse != null &&
            (!errorResponse.Message.IsNullOrWhiteSpace() || errorResponse.Code > 0))
        {
            throw exceptionFactory?.Invoke(errorResponse, httpResponse)
                ?? new OpenObserveException(
                    errorResponse.Message ?? "OpenObserve request failed",
                    errorResponse,
                    (int)httpResponse.StatusCode,
                    responseContent);
        }

        throw new OpenObserveRequestException(httpResponse, responseContent);
    }

    protected async virtual Task<TResponse?> SendJsonAsync<TRequest, TResponse>(
        HttpMethod method,
        string requestUri,
        TRequest? request = default,
        Func<OpenObserveErrorResponse, HttpResponseMessage, Exception>? exceptionFactory = null,
        CancellationToken cancellationToken = default)
    {
        using var httpRequest = new HttpRequestMessage(method, requestUri);
        if (request != null)
        {
            httpRequest.Content = CreateJsonContent(request);
        }

        var httpResponse = await HttpClient.SendAsync(httpRequest, cancellationToken);

        await EnsureSuccessStatusCode(httpResponse, exceptionFactory, cancellationToken);

        var responseContent = await httpResponse.Content.ReadAsStringAsync(cancellationToken);

        return DeserializeOrDefault<TResponse>(responseContent);
    }

    protected async virtual Task<TResponse?> GetAsync<TResponse>(
        string requestUri,
        Func<OpenObserveErrorResponse, HttpResponseMessage, Exception>? exceptionFactory = null,
        CancellationToken cancellationToken = default)
    {
        return await SendJsonAsync<object, TResponse>(
            HttpMethod.Get,
            requestUri,
            null,
            exceptionFactory,
            cancellationToken);
    }

    protected async virtual Task<TResponse?> PostJsonAsync<TRequest, TResponse>(
        string requestUri,
        TRequest? request = default,
        Func<OpenObserveErrorResponse, HttpResponseMessage, Exception>? exceptionFactory = null,
        CancellationToken cancellationToken = default)
    {
        return await SendJsonAsync<TRequest, TResponse>(
            HttpMethod.Post,
            requestUri,
            request,
            exceptionFactory,
            cancellationToken);
    }

    protected async virtual Task<TResponse?> PutJsonAsync<TRequest, TResponse>(
        string requestUri,
        TRequest? request = default,
        Func<OpenObserveErrorResponse, HttpResponseMessage, Exception>? exceptionFactory = null,
        CancellationToken cancellationToken = default)
    {
        return await SendJsonAsync<TRequest, TResponse>(
            HttpMethod.Put,
            requestUri,
            request,
            exceptionFactory,
            cancellationToken);
    }

    protected async virtual Task<TResponse?> DeleteAsync<TResponse>(
        string requestUri,
        Func<OpenObserveErrorResponse, HttpResponseMessage, Exception>? exceptionFactory = null,
        CancellationToken cancellationToken = default)
    {
        return await SendJsonAsync<object, TResponse>(
            HttpMethod.Delete,
            requestUri,
            null,
            exceptionFactory,
            cancellationToken);
    }

    protected virtual TResponse? DeserializeOrDefault<TResponse>(string? content)
    {
        if (content.IsNullOrWhiteSpace())
        {
            return default;
        }

        return Serializer.Deserialize<TResponse>(content);
    }
}
