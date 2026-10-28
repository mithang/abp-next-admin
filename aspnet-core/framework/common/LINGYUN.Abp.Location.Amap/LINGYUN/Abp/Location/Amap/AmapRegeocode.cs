using Newtonsoft.Json;
using System.Collections.Generic;

namespace LINGYUN.Abp.Location.Amap
{
    public class AmapRegeocode
    {
        /// <summary>
        /// Thông tin địa chỉ có cấu trúc
        /// Tỉnh + thành phố + quận/huyện + thị trấn + làng + đường phố + số nhà
        /// </summary>
        [JsonProperty("formatted_address")]
        public string Address { get; set; }
        /// <summary>
        /// Danh sách thành phần địa chỉ
        /// </summary>
        public AddressComponent AddressComponent { get; set; }
        /// <summary>
        /// Danh sách thông tin đường
        /// Trả về khi tham số yêu cầu extensions là all
        /// </summary>
        public Road[] Roads { get; set; }
        /// <summary>
        /// Danh sách giao lộ đường
        /// Trả về khi tham số yêu cầu extensions là all
        /// </summary>
        public Roadinter[] Roadinters { get; set; }
        /// <summary>
        /// Danh sách thông tin POI
        /// Trả về khi tham số yêu cầu extensions là all
        /// </summary>
        public Poi[] Pois { get; set; }
        /// <summary>
        /// Danh sách thông tin AOI
        /// Trả về khi tham số yêu cầu extensions là all
        /// </summary>
        public Aoi[] Aois { get; set; }
        public AmapRegeocode()
        {
            AddressComponent = new AddressComponent();
            Roads = new Road[0];
            Roadinters = new Roadinter[0];
            Pois = new Poi[0];
            Aois = new Aoi[0];
        }
    }

    public class AddressComponent
    {
        /// <summary>
        /// Quốc gia
        /// </summary>
        public string Country { get; set; }
        /// <summary>
        /// Tên tỉnh nơi điểm tọa độ nằm
        /// Ví dụ: thành phố Bắc Kinh
        /// </summary>
        public string Province { get; set; }

        /// <summary>
        /// Tên thành phố nơi điểm tọa độ nằm
        /// Lưu ý: trả về rỗng khi thành phố là huyện trực thuộc tỉnh, và khi thành phố là một trong bốn thành phố trực thuộc trung ương Bắc Kinh, Thượng Hải, Thiên Tân, Trùng Khánh thì trường này trả về rỗng
        /// </summary>
        public string[] City { get; set; }

        /// <summary>
        /// Mã thành phố
        /// Ví dụ: 010
        /// </summary>
        public string CityCode { get; set; }

        /// <summary>
        /// Quận nơi điểm tọa độ nằm
        /// Ví dụ: quận Hải Điến
        /// </summary>
        public string District { get; set; }

        /// <summary>
        /// Mã đơn vị hành chính
        /// Ví dụ: 110108
        /// </summary>
        public string AdCode { get; set; }

        /// <summary>
        /// Xã/thị trấn/phố nơi điểm tọa độ nằm (phố này là phố cộng đồng, không phải thông tin đường)
        /// Ví dụ: phố Yến Viên
        /// </summary>
        public string[] TownShip { get; set; }

        /// <summary>
        /// Mã xã/phố
        /// Ví dụ: 110101001000
        /// </summary>
        public string TownCode { get; set; }
        /// <summary>
        /// Danh sách thông tin cộng đồng
        /// </summary>
        public NeighBorHood NeighBorHood { get; set; }
        /// <summary>
        /// Danh sách thông tin tòa nhà
        /// </summary>
        public Building Building { get; set; }
        /// <summary>
        /// Danh sách thông tin số nhà
        /// </summary>
        public StreetNumber StreetNumber { get; set; }
        /// <summary>
        /// Thông tin vùng biển trực thuộc
        /// Ví dụ: Bột Hải
        /// </summary>
        public string SeaArea { get; set; }
        /// <summary>
        /// Danh sách khu thương mại nơi kinh vĩ độ thuộc về
        /// </summary>
        public List<BusinessArea> BusinessAreas { get; set; }
        public AddressComponent()
        {
            NeighBorHood = new NeighBorHood();
            Building = new Building();
            StreetNumber = new StreetNumber();
            BusinessAreas = new List<BusinessArea>();
        }
    }

    /// <summary>
    /// Thông tin cộng đồng
    /// </summary>
    public class NeighBorHood
    {
        /// <summary>
        /// Tên cộng đồng
        /// Ví dụ: Đại học Bắc Kinh
        /// </summary>
        public string[] Name { get; set; } = new string[0];

        /// <summary>
        /// Loại POI
        /// Ví dụ: Dịch vụ khoa học, giáo dục và văn hóa; trường học; cơ sở giáo dục đại học
        /// </summary>
        public string[] Type { get; set; } = new string[0];
    }
    /// <summary>
    /// Thông tin tòa nhà
    /// </summary>
    public class Building
    {
        /// <summary>
        /// Tên công trình
        /// Ví dụ: Quảng trường Vạn Đạt
        /// </summary>
        public string[] Name { get; set; } = new string[0];

        /// <summary>
        /// Loại
        /// Ví dụ: Dịch vụ khoa học, giáo dục và văn hóa; trường học; cơ sở giáo dục đại học
        /// </summary>
        public string[] Type { get; set; } = new string[0];
    }
    /// <summary>
    /// Thông tin đường phố
    /// </summary>
    public class StreetNumber
    {
        /// <summary>
        /// Tên đường phố
        /// Ví dụ: Trung Quan Thôn Bắc Nhị Điều
        /// </summary>
        public string Street { get; set; }

        /// <summary>
        /// Số nhà
        /// Ví dụ: số 3
        /// </summary>
        public string Number { get; set; }

        /// <summary>
        /// Điểm tọa độ
        /// Điểm tọa độ kinh vĩ độ: kinh độ, vĩ độ
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// Hướng
        /// Phương vị đường phố nơi điểm tọa độ nằm
        /// </summary>
        public string Direction { get; set; }

        /// <summary>
        /// Khoảng cách từ địa chỉ số nhà đến tọa độ yêu cầu
        /// Đơn vị: mét
        /// </summary>
        public string Distance { get; set; }
    }

    /// <summary>
    /// Thông tin khu thương mại
    /// </summary>
    public class BusinessArea
    {
        /// <summary>
        /// Kinh vĩ độ điểm trung tâm khu thương mại
        /// Điểm tọa độ kinh vĩ độ: kinh độ, vĩ độ
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// Tên khu thương mại 
        /// Ví dụ: Di Hòa Viên
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// adcode của khu vực nơi khu thương mại nằm  
        /// Ví dụ: quận Triều Dương/quận Hải Điến 
        /// </summary>
        public string Id { get; set; }
    }

    /// <summary>
    /// Thông tin đường
    /// </summary>
    public class Road
    {
        /// <summary>
        /// Id đường
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// Tên đường
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Khoảng cách từ đường đến tọa độ yêu cầu
        /// Đơn vị: mét
        /// </summary>
        public string Distance { get; set; }
        /// <summary>
        /// Phương vị
        /// Phương vị tương đối giữa điểm nhập và đường này
        /// </summary>
        public string Direction { get; set; }
        /// <summary>
        /// Điểm tọa độ
        /// Điểm tọa độ kinh vĩ độ: kinh độ, vĩ độ
        /// </summary>
        public string Location { get; set; }
    }

    /// <summary>
    /// Giao lộ đường
    /// </summary>
    public class Roadinter
    {
        /// <summary>
        /// Khoảng cách từ ngã tư đến tọa độ yêu cầu
        /// Đơn vị: mét
        /// </summary>
        public string Distance { get; set; }
        /// <summary>
        /// Phương vị
        /// Phương vị của điểm nhập so với ngã tư
        /// </summary>
        public string Direction { get; set; }
        /// <summary>
        /// Kinh vĩ độ ngã tư
        /// </summary>
        public string Location { get; set; }
        /// <summary>
        /// Id đường thứ nhất
        /// </summary>
        [JsonProperty("first_id")]
        public string FirstId { get; set; }
        /// <summary>
        /// Tên đường thứ nhất
        /// </summary>
        [JsonProperty("first_name")]
        public string FirstName { get; set; }
        /// <summary>
        /// Id đường thứ hai
        /// </summary>
        [JsonProperty("second_id")]
        public string SecondId { get; set; }
        /// <summary>
        /// Tên đường thứ hai
        /// </summary>
        [JsonProperty("second_name")]
        public string SecondName { get; set; }
    }

    /// <summary>
    /// Thông tin POI
    /// </summary>
    public class Poi
    {
        /// <summary>
        /// Thông tin POI
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// Tên điểm POI
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Loại POI
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// Điện thoại
        /// </summary>
        public string Tel { get; set; }
        /// <summary>
        /// Khoảng cách từ điểm trung tâm của POI này đến tọa độ yêu cầu
        /// Đơn vị: mét
        /// </summary>
        public string Distance { get; set; }
        /// <summary>
        /// Hướng
        /// Là phương vị của điểm nhập so với công trình
        /// </summary>
        public string Direction { get; set; }
        /// <summary>
        /// Thông tin địa chỉ POI
        /// </summary>
        public string Address { get; set; }
        /// <summary>
        /// Điểm tọa độ
        /// </summary>
        public string Location { get; set; }
        /// <summary>
        /// Tên khu thương mại nơi POI nằm
        /// </summary>
        public string BusinessArea { get; set; }
    }
    /// <summary>
    /// Thông tin AOI
    /// </summary>
    public class Aoi
    {
        /// <summary>
        /// Id của AOI trực thuộc
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// Tên AOI trực thuộc
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Mã khu vực nơi AOI trực thuộc nằm
        /// </summary>
        public string AdCode { get; set; }
        /// <summary>
        /// Tọa độ điểm trung tâm của AOI trực thuộc
        /// </summary>
        public string Location { get; set; }
        /// <summary>
        /// Diện tích điểm AOI trực thuộc
        /// Đơn vị: mét vuông
        /// </summary>
        public string Area { get; set; }
        /// <summary>
        /// Kinh vĩ độ nhập vào có nằm trong mặt AOI hay không
        /// 0 nghĩa là nằm trong AOI, các số nguyên còn lại biểu thị khoảng cách tới AOI
        /// </summary>
        public string Distance { get; set; }
    }
}
