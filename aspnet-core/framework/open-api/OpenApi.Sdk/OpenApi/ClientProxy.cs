using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace OpenApi
{
    public class ClientProxy : IClientProxy
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public ClientProxy(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async virtual Task<ApiResponse<TResult>> DeleteAsync<TResult>(string url, string appKey, string appSecret)
        {
            return await RequestAsync<TResult>(url, appKey, appSecret, HttpMethod.Delete);
        }

        public async virtual Task<ApiResponse<TResult>> GetAsync<TResult>(string url, string appKey, string appSecret)
        {
            return await RequestAsync<TResult>(url, appKey, appSecret, HttpMethod.Get);
        }

        public async virtual Task<ApiResponse<TResult>> PostAsync<TRequest, TResult>(string url, string appKey, string appSecret, TRequest request)
        {
            return await RequestAsync<TRequest, TResult>(url, appKey, appSecret, request, HttpMethod.Post);
        }

        public async virtual Task<ApiResponse<TResult>> PutAsync<TRequest, TResult>(string url, string appKey, string appSecret, TRequest request)
        {
            return await RequestAsync<TRequest, TResult>(url, appKey, appSecret, request, HttpMethod.Put);
        }

        public async virtual Task<ApiResponse<TResult>> RequestAsync<TResult>(string url, string appKey, string appSecret, HttpMethod httpMethod)
        {
            return await RequestAsync<object, TResult>(url, appKey, appSecret, null, httpMethod);
        }

        public async virtual Task<ApiResponse<TResult>> RequestAsync<TRequest, TResult>(string url, string appKey, string appSecret, TRequest request, HttpMethod httpMethod)
        {
            // Xây dựng client gửi yêu cầu
            var client = _httpClientFactory.CreateClient("opensdk");

            return await RequestAsync<TRequest, TResult>(client, url, appKey, appSecret, request, httpMethod);
        }

        public async virtual Task<ApiResponse<TResult>> RequestAsync<TRequest, TResult>(HttpClient client, string url, string appKey, string appSecret, TRequest request, HttpMethod httpMethod)
        {
            // Dấu thời gian UTC
            var timeStamp = GetUtcTimeStampString();
            // Số ngẫu nhiên
            var nonce = Guid.NewGuid().ToString();
            // Lấy địa chỉ api
            var baseUrl = url.Split('?')[0];
            // Lắp ráp tham số yêu cầu
            var requestUrl = string.Concat(
                url,
                url.Contains('?') ? "&" : "?",
                "appKey=",
                appKey,
                "appSecret=",
                appSecret,
                "nonce=",
                nonce,
                "&t=",
                timeStamp);
            var queryString = ReverseQueryString(requestUrl);
            // Ký tham số yêu cầu
            var sign = CalculationSignature(baseUrl, queryString);

            // Xây dựng thân yêu cầu
            var requestMessage = new HttpRequestMessage(httpMethod, url);

            if (request != null)
            {
                // Request Payload
                requestMessage.Content = new StringContent(JsonConvert.SerializeObject(request));
            }
            // Thêm appKey vào headers
            requestMessage.Headers.TryAddWithoutValidation("X-API-APPKEY", appKey);
            // Thêm số ngẫu nhiên vào headers
            requestMessage.Headers.TryAddWithoutValidation("X-API-NONCE", nonce);
            // Thêm dấu thời gian vào headers
            requestMessage.Headers.TryAddWithoutValidation("X-API-TIMESTAMP", timeStamp);
            // Thêm chữ ký vào headers
            requestMessage.Headers.TryAddWithoutValidation("X-API-SIGN", sign);
            // Trả về thông báo lỗi đã bản địa hóa
            requestMessage.Headers.AcceptLanguage.Add(new StringWithQualityHeaderValue(CultureInfo.CurrentUICulture.Name));
            // Thông báo lỗi trả về có thể tuần tự hóa
            requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            // Tuần tự hóa phản hồi
            var response = await client.SendAsync(requestMessage);

            var stringContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<ApiResponse<TResult>>(stringContent);
        }

        protected virtual string GetUtcTimeStampString()
        {
            return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
        }

        private static IDictionary<string, string> ReverseQueryString(string requestUri)
        {
            if (!requestUri.Contains("?"))
            {
                throw new Exception("Định dạng đường dẫn truy vấn không hợp lệ");
            }

            var queryString = requestUri.Split('?')[1];
            // Sắp xếp theo chữ cái đầu
            var paramters = queryString.Split('&').OrderBy(p => p);

            var queryDic = new Dictionary<string, string>();
            foreach (var parm in paramters)
            {
                var thisParams = parm.Split('=');
                if (thisParams.Length == 0)
                {
                    continue;
                }
                queryDic.Add(thisParams[0], thisParams.Length > 0 ? thisParams[1] : "");
            }

            // Trả về danh sách tham số
            return queryDic;
        }

        private static string CalculationSignature(string url, IDictionary<string, string> queryDictionary)
        {
            var queryString = BuildQuery(queryDictionary);
            var requestUrl = string.Concat(
                url,
                url.Contains('?') ? "" : "?",
                queryString);
            var encodeUrl = UrlEncode(requestUrl);
            return encodeUrl.ToMd5();
        }

        private static string BuildQuery(IDictionary<string, string> queryStringDictionary)
        {
            StringBuilder sb = new StringBuilder();
            foreach (var queryString in queryStringDictionary.OrderBy(q => q.Key))
            {
                sb.Append(queryString.Key)
                  .Append('=')
                  .Append(queryString.Value)
                  .Append('&');
            }
            sb.Remove(sb.Length - 1, 1);
            return sb.ToString();
        }

        private static string UrlEncode(string str)
        {
            return HttpUtility.UrlEncode(str, Encoding.UTF8).ToUpper();
        }
    }
}
