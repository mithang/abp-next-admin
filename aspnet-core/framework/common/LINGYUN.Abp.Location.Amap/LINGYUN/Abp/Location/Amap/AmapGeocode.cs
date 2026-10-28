using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Amap
{
    /// <summary>
    /// Định dạng tham số trả về của bản đồ Amap thật kỳ quặc
    /// Đã ngừng sử dụng
    /// </summary>
    public class AmapGeocode
    {
        /// <summary>
        /// Thông tin địa chỉ có cấu trúc
        /// Tỉnh + thành phố + quận/huyện + thị trấn + thôn/xóm + đường phố + số nhà
        /// </summary>
        [JsonProperty("formatted_address")]
        public string Address { get; set; }

        /// <summary>
        /// Quốc gia
        /// Địa chỉ trong nước mặc định trả về Trung Quốc
        /// </summary>
        [JsonProperty("country")]
        public string Country { get; set; }

        /// <summary>
        /// Tên tỉnh nơi địa chỉ tọa lạc
        /// Ví dụ: Bắc Kinh. Cần lưu ý, bốn thành phố trực thuộc trung ương của Trung Quốc cũng được tính là đơn vị cấp tỉnh.
        /// </summary>
        [JsonProperty("province")]
        public string Province { get; set; }

        /// <summary>
        /// Tên thành phố nơi địa chỉ tọa lạc
        /// Ví dụ: Bắc Kinh
        /// </summary>
        [JsonProperty("city")]
        public string City { get; set; }

        /// <summary>
        /// Mã thành phố
        /// Ví dụ: 010
        /// </summary>
        [JsonProperty("citycode")]
        public string CityCode { get; set; }

        /// <summary>
        /// Quận nơi địa chỉ tọa lạc
        /// Ví dụ: Triều Dương
        /// </summary>
        [JsonProperty("district")]
        public string District { get; set; }

        /// <summary>
        /// Phường/thị trấn nơi điểm tọa độ tọa lạc (đường phố này là đường phố cộng đồng, không phải thông tin đường giao thông)
        /// Ví dụ: Phường Yến Viên
        /// </summary>
        public string[] TownShip { get; set; } = new string[0];

        /// <summary>
        /// Danh sách thông tin cộng đồng
        /// </summary>
        public NeighBorHood NeighBorHood { get; set; } = new NeighBorHood();

        /// <summary>
        /// Danh sách thông tin tòa nhà
        /// </summary>
        public Building Building { get; set; } = new Building();

        /// <summary>
        /// Đường phố
        /// Ví dụ: Đường Phú Thông Đông
        /// </summary>
        [JsonProperty("street")]
        public string[] Street { get; set; } = new string[0];

        /// <summary>
        /// Số nhà
        /// Ví dụ: số 6
        /// </summary>
        [JsonProperty("number")]
        public string[] Number { get; set; } = new string[0];

        /// <summary>
        /// Mã khu vực
        /// Ví dụ: 110101
        /// </summary>
        [JsonProperty("adcode")]
        public string Adcode { get; set; }

        /// <summary>
        /// Điểm tọa độ
        /// Kinh độ, vĩ độ
        /// </summary>
        [JsonProperty("location")]
        public string Location { get; set; }

        /// <summary>
        /// Mức độ khớp
        /// Ví dụ: Triều Dương
        /// </summary>
        [JsonProperty("level")]
        public string Level { get; set; }
    }
}
