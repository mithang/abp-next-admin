namespace LINGYUN.Abp.Location.Amap
{
    public class AmapInverseHttpRequestParamter
    {
        /// <summary>
        /// Tọa độ kinh vĩ độ
        /// 
        /// Quy tắc nội dung truyền vào: kinh độ đứng trước, vĩ độ đứng sau, giữa kinh vĩ độ phân tách bằng “,”, phần thập phân của kinh vĩ độ không vượt quá 6 chữ số.
        /// Nếu cần phân tích nhiều kinh vĩ độ, hãy dùng "|" để ngăn cách, đồng thời đặt tham số batch thành true, hỗ trợ tối đa 20 cặp điểm tọa độ.
        /// Giữa mỗi cặp điểm tọa độ dùng "|" để phân tách.
        /// </summary>
        public Location[] Locations { get; set; } = new Location[0];
        /// <summary>
        /// Trả về loại POI gần đó
        /// Nội dung dưới đây chỉ có hiệu lực khi tham số extensions là all.
        /// Mã hóa địa lý ngược sau khi phân tích tọa độ không chỉ có thể trả về mô tả địa chỉ mà còn có thể trả về nội dung POI gần kinh vĩ độ đáp ứng yêu cầu giới hạn (chỉ khi giá trị trường extensions là all mới trả về nội dung POI).
        /// Đặt tham số loại POI tương đương với việc giới hạn yêu cầu cho thao tác trên.
        /// 
        /// Tham số chỉ hỗ trợ truyền vào POI TYPECODE, có thể truyền nhiều POI TYPECODE, ngăn cách nhau bằng “|”.
        /// Tham số này không có hiệu lực khi batch có giá trị true. Lấy POI TYPECODE
        /// </summary>
        public string PoiType { get; set; }
        /// <summary>
        /// Bán kính tìm kiếm
        /// Giá trị radius trong khoảng 0~3000, mặc định là 1000. Đơn vị: mét
        /// </summary>
        public short Radius { get; set; } = 1000;
        /// <summary>
        /// Điều khiển kết quả trả về
        /// Giá trị mặc định của tham số extensions là base, tức là trả về thông tin địa chỉ cơ bản;
        /// Khi tham số extensions có giá trị all sẽ trả về thông tin địa chỉ cơ bản, nội dung POI gần đó, thông tin đường và thông tin giao lộ.
        /// </summary>
        public string Extensions { get; set; } = "base";
        /// <summary>
        /// Điều khiển truy vấn hàng loạt
        /// Khi tham số batch được đặt thành true sẽ thực hiện truy vấn hàng loạt, hỗ trợ tối đa 20 điểm kinh vĩ độ để truy vấn địa chỉ hàng loạt.
        /// Khi tham số batch được đặt thành false sẽ truy vấn từng điểm, lúc này dù truyền nhiều kinh vĩ độ cũng chỉ trả về kết quả phân tích địa chỉ của kinh vĩ độ đầu tiên.
        /// </summary>
        public bool Batch { get; set; } = false;
        /// <summary>
        /// Cấp đường
        /// 
        /// Nội dung dưới đây chỉ có hiệu lực khi tham số extensions là all.
        /// Giá trị tùy chọn: 0, 1
        /// Khi roadlevel=0, hiển thị tất cả các đường
        /// Khi roadlevel = 1, lọc các đường không phải đường chính, chỉ xuất dữ liệu đường chính
        /// </summary>
        public sbyte? RoadLevel { get; set; }
        /// <summary>
        /// Chữ ký số
        /// </summary>
        public string Sig { get; set; }
        /// <summary>
        /// Loại định dạng dữ liệu trả về
        /// Nội dung đầu vào tùy chọn bao gồm: JSON, XML. Đặt JSON thì dữ liệu kết quả trả về sẽ được cấu thành theo cấu trúc JSON;
        /// Nếu đặt XML thì dữ liệu kết quả trả về sẽ được cấu thành theo cấu trúc XML.
        /// </summary>
        public string Output { get; set; } = "JSON";
        /// <summary>
        /// Có tối ưu thứ tự trả về POI hay không
        /// Nội dung dưới đây chỉ có hiệu lực khi tham số extensions là all.
        /// Việc đặt tham số homeorcorp có thể ảnh hưởng đến chiến lược sắp xếp nội dung POI được gợi lại, hiện cung cấp ba tham số tùy chọn:
        /// 
        /// 0: Không can thiệp vào chiến lược sắp xếp gợi lại.
        /// 
        /// 1: Dựa trên phân tích dữ liệu lớn tổng hợp, ưu tiên trả về nội dung POI liên quan đến nhà ở, tức là tối ưu thứ tự poi trong trường pois của kết quả trả về.
        /// 
        /// 2: Dựa trên phân tích dữ liệu lớn tổng hợp, ưu tiên trả về nội dung POI liên quan đến công ty, tức là tối ưu thứ tự poi trong trường pois của kết quả trả về.
        /// </summary>
        public sbyte HomeOrCorp { get; set; } = 0;
    }
}
