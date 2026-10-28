using System;

namespace OpenApi
{
    [Serializable]
    public class ApiResponse<TResult>
    {
        /// <summary>
        /// Mã lỗi
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// Thông báo nhắc lỗi
        /// </summary>
        public string Message { get; set; }
        /// <summary>
        /// Thông báo bổ sung
        /// </summary>
        public string Details { get; set; }
        /// <summary>
        /// Giá trị trả về
        /// </summary>
        public TResult Result { get; set; }
        public ApiResponse() { }
        public ApiResponse(
            string code,
            string message,
            string details = null)
        {
            Code = code;
            Message = message;
            Details = details;
        }

        public ApiResponse(
            string code,
            TResult result,
            string message = "OK")
        {
            Code = code;
            Result = result;
            Message = message;
        }
    }
}
