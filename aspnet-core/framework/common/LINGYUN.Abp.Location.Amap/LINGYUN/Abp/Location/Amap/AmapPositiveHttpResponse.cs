using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Amap
{
    /// <summary>
    /// Kết quả phân tích địa chỉ thuận
    /// </summary>
    public class AmapPositiveHttpResponse : AmapHttpResponse
    {
        /// <summary>
        /// Số lượng kết quả trả về
        /// </summary>
        /// <remarks>
        /// Số lượng kết quả trả về.
        /// </remarks>
        public int Count { get; set; }

        /// <summary>
        /// Danh sách thông tin mã địa lý
        /// </summary>
        [JsonProperty("geocodes")]
        public AmapGeocode[] Geocodes { get; set; }

        public AmapPositiveHttpResponse()
        {
            Geocodes = new AmapGeocode[0];
        }
    }
}
